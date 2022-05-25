import { extend } from './_helpers';

// Import design
import './scss/tarteaucitron.scss';

import * as services from './services';
import en from "./i18n/en";

class TarteAuCitron {
    #availableLanguages = ['bg', 'ca', 'cn', 'cs', 'da', 'de', 'el', 'en', 'es', 'fi', 'fr', 'hu', 'it', 'ja', 'lt', 'lv', 'nl', 'no', 'oc', 'pl', 'pt', 'ro', 'ru', 'se', 'sk', 'sv', 'tr', 'vi', 'zh'];
    #version = 20220420;
    #alreadyLaunch = false;
    #state = [];

    events = {
        "init": function () {},
        "load": function () {},
    }
    user = {
        byPass:  false,
    }
    #lang = {};
    #added = {};
    job = [];
    #launch = {};
    #cookieOwner = {};

    #options = {
        privacyUrl: "", /* Privacy policy url */
        hashtag: '#tarteaucitron', /* Open the panel with this hashtag */
        cookieName: 'tarteaucitron', /* Cookie name */

        orientation: 'middle', /* Banner position (top - bottom - middle - popup) */

        groupServices: false, /* Group services by category */

        showAlertSmall: false, /* Show the small banner on bottom right */
        cookiesList: false, /* Show the cookie list */

        closePopup: true, /* Show a close X on the banner */

        showIcon: true, /* Show cookie icon to manage cookies */
        iconSrc: null, /* Optionnal: URL or base64 encoded image */
        iconPosition: 'BottomRight', /* BottomRight, BottomLeft, TopRight and TopLeft */

        adBlocker: false, /* Show a Warning if an adblocker is detected */
        noAdsBlocker: false, /* Update with await import, if value is true, no AdsBlocker detect */

        denyAllCta: true, /* Show deny all button */
        acceptAllCta: true, /* Show accept all button */
        //highPrivacy: true, /* HIGHLY RECOMMANDED Disable auto consent */

        //handleBrowserDNTRequest: false, /* If Do Not Track == 1, disallow all */

        removeCredit: true, /* Remove credit link */
        moreInfoLink: true, /* Show more info link */

        /*cookieDomain: '.my-multisite-domaine.fr'', /* Shared cookie for multisite */

        readMoreLink: '', /* Change the default readmore link */

        mandatory: true, /* Show a message about mandatory cookies */
        forceLanguage: null,
        reloadThePage: false,
        forceExpire: null, /* Force expire after (int) days, default 365 days*/
        cookieDomain: null, /* Shared cookie for multisite */
        customTranslation: {}
    };

    constructor(options = {}){
        this.#options = extend(this.#options, options);
    }

    async init() {
        if (this.#alreadyLaunch === false) {
            this.#alreadyLaunch = true;

            // Await on load to ensure retrieve lang file
            await this.#load();

            window.addEventListener('keydown', this.#keydownEvent, false);
            window.addEventListener('hashchange', this.#hashChangeEvent, false);
            //window.addEventListener('resize', this.#resizeEvent, false);
        }
    }

    #keydownEvent = (evt) => {
        let tac = document.getElementById('tarteaucitron');

        if(null === tac || window.getComputedStyle(tac).display !== 'flex') {
            return;
        }

        if (evt.keyCode === 27) {
            this.#uiClosePanel();
        }
    }

    #hashChangeEvent = () => {
        if (document.location.hash === this.#options.hashtag && this.#options.hashtag !== '') {
            this.#uiOpenPanel();
        }
    }

    static fallback = (matchClass, content, noInner) => {
        let elems = document.getElementsByClassName(matchClass);

        for(let item of elems){
            if (typeof content === 'function') {
                if (noInner === true) {
                    content(item);
                } else {
                    if(item.children.length === 0){
                        item.appendChild(content(item));
                    } else {
                        item.replaceChild(content(item), item.children[0]);
                    }
                }
            } else {
                item.innerHTML = content;
            }
        }
    }

    #createElement = (type, appendTo = null, options = {}, content = null) => {
        let elem = document.createElement(type);

        for(let i in options){
            elem.setAttribute(i, options[i]);
        }

        if(content !== null){
            elem.appendChild(document.createTextNode(content));
        }

        // Try to append, no action if error
        if(appendTo !== null){
            try{
                appendTo.appendChild(elem)
            } catch(e){
                console.error('An error occurred when append to ', appendTo);
            }
        }

        return elem;
    }

    #createButton = (state = true, text, options = {}, spanOptions = {}) => {
        options = extend({
            'class': 'ctaBtn btn'+(state ? 'Allow' : 'Deny'),
            'tabindex': '-1',
            'type': 'button',
        }, options);

        spanOptions = extend({
            'class': state ? 'check' : 'cross'
        }, spanOptions);

        let button = this.#createElement('button', null, options);
        this.#createElement('span', button, spanOptions);

        button.appendChild(document.createTextNode(text));

        return button;
    }

    #addAttributes = (elem, options = {}) => {
        for(let i in options){
            elem.setAttribute(i, options[i]);
        }

        return elem;
    }

    async #load() {
        // Don't show the middle bar if we are on the privacy policy or more page
        if (((this.#options.readmoreLink !== undefined && window.location.href === this.#options.readmoreLink) || window.location.href === this.#options.privacyUrl) && this.#options.orientation === "middle") {
            this.#options.orientation = "bottom";
        }

        // Step 1: load language
        let language = this.#getLanguage();

        this.#lang = await import(`./i18n/${language}`)
            .then(result => result.default);

        this.#lang = this.#addOrUpdate(this.#lang, this.#options.customTranslation);

        // Fetch advertising to catch adBlocker
        this.#options.noAdsBlocker = await this.checkForAdBlocker();

        let body = document.body,
            // Create root element
            tacRoot = this.#createElement('div', null, {
                'id': 'tarteaucitronRoot',
                'class': 'tac-' + this.#options.orientation.toLowerCase(),
                'data-nosnippet': 'true',
                'lang': language,
                'role': 'region',
            }),
            orientation = this.#options.orientation === 'bottom' ? 'Bottom' : 'Top',
            cat = ['ads', 'analytic', 'api', 'comment', 'social', 'support', 'video', 'other'],
            i,
            lang = this.#lang
        ;

        // Sort category by translation name
        cat = cat.sort(function (a, b) {
            if (lang[a].title > lang[b].title) {
                return 1;
            }
            if (lang[a].title < lang[b].title) {
                return -1;
            }
            return 0;
        });

        // Step 2 If adBlocker is detected, show pop-up to allow this website
        if (this.#options.adBlocker === true && this.#options.noAdsBlocker === false) {
            let bodyPosition = this.#options.bodyPosition;
            tacRoot = this.#createElement('div', null, {
                'id': 'tarteaucitronRoot',
            })
            body.appendChild(tacRoot);

            let tacBig = this.#createElement('div', tacRoot, {
                'id': 'alertBig',
                'class': 'alertBig alertBig' + orientation,
                'role': 'alert',
                'aria-live': 'polite',
            });

            this.#createElement('div', tacBig, {
                'class': 'disclaimerAlert',
                'id': 'disclaimerAlert',
            }, lang.adblock)
                .appendChild(this.#createElement('div', null, {}, lang.adblock_call));

            this.#createElement('button', tacBig, {
                'type': 'button',
                'class': 'ctaBtn personalize',
                'id': 'ctaBtn',
            }, lang.reload)
                .addEventListener('click', function () {
                    location.reload();
                });

            if (bodyPosition === 'top') {
                // Prepend tarteaucitron: #tarteaucitronRoot first-child of the body for better accessibility
                let bodyFirstChild = body.firstChild;
                body.insertBefore(tacRoot, bodyFirstChild);
            } else {
                // Append tarteaucitron: #tarteaucitronRoot last-child of the body
                body.appendChild(tacRoot);
            }

            this.#uiOpenAlert();

            return;
        }

        // Step 3: prepare the html
        if (this.#options.noAdsBlocker === true) {
            if (this.#options.bodyPosition === 'top') {
                // Prepend tarteaucitron: #tarteaucitronRoot first-child of the body for better accessibility
                let bodyFirstChild = body.firstChild;
                body.insertBefore(tacRoot, bodyFirstChild);
            } else {
                // Append tarteaucitron: #tarteaucitronRoot last-child of the body
                body.appendChild(tacRoot);
            }
        }

        // Create TAC Dom
        this.#createElement('div', tacRoot,  {
            'id': 'tacBack',
            'class': 'back',
        });

        let tacDiv = this.#createElement('div', tacRoot, {
            'id':  'tarteaucitron',
            'role':  'dialog',
            'aria-modal':  'true',
            'aria-describedby':  'info',
            'aria-labelledby':  'dialogTitle',
        });

        let tacCloseCtn = this.#createElement('div', tacDiv, {
            'class': 'closeBtnCtn',
        });

        let closePanel = this.#createElement('button', tacCloseCtn, {
            'type': 'button',
            'id': 'closePanel',
            'class': 'closePanel',
        }, lang.close);
        closePanel.addEventListener('click', this.#uiClosePanel);

        if(this.#options.reloadThePage){
            this.#addAttributes(closePanel, {
                'aria-label':  lang.close+ ' (' + lang.reload + ')',
                'title':  lang.close + ' (' + lang.reload + ')',
            });
        }

        let tacServices = this.#createElement('div', tacDiv, {
                'id': 'services',
            }),
            tacMainLine = this.#createElement('div', tacServices, {
                'class': 'mainLine',
                'id': 'mainLineOffset',
            });
        tacMainLine.appendChild(this.#createElement('div', tacMainLine, {
            'class': 'tacH1',
            'role': 'heading',
            'aria-level': '1',
            'id': 'dialogTitle',
        }, lang.title));

        let tacInfo = this.#createElement('div', tacMainLine, {
            'id' : 'info',
        }, lang.disclaimer);

        if (this.#options.privacyUrl !== "") {
            this.#createElement('button', tacInfo, {
                'type': 'button',
                'class': 'ctaBtn privacyUrl',
                'tole': 'link',
            }, lang.privacyUrl)
                .addEventListener('click', this.#redirectToPrivacy);
        }


        let serviceLine = this.#createElement('div', tacMainLine, {'class': 'serviceLine line'}),
            tacName = this.#createElement('div', serviceLine, {'class': 'name'}),
            tacAsk = this.#createElement('div', serviceLine, {'class': 'ask', 'id': 'tarteaucitronScrollbarAdjust'});

        let allowAll = this.#createButton(true, lang.allowAll, {
                'id': 'allAllowed',
                'data-state': true,
            }),
            denyAll = this.#createButton(false, lang.denyAll, {
                'id': 'allDenied',
                'data-state': false,
            });

        allowAll.addEventListener('click', this.#uiRespondAll);
        denyAll.addEventListener('click', this.#uiRespondAll);
        tacAsk.appendChild(allowAll);
        tacAsk.appendChild(denyAll);

        this.#createElement('span', tacName, {
            'class': 'tacH2',
            'role': 'heading',
            'aria-level': '2',
        }, lang.all);

        let tacBorder = this.#createElement('div', tacServices,  {
            'class': 'tarteaucitronBorder'
        });

        let catsUl = this.#createElement('ul', tacBorder);

        if(this.#options.mandatory === true){
            this
                .#createElement('li', catsUl, {
                    'id': 'servicesTitle_mandatory',
                    'class': 'catLine show',
                })
                .appendChild(this.#createElement('div', null, {
                    'class': 'tarteaucitronTitle'
                }))
                .appendChild(
                    this.#createButton(true, lang.mandatoryTitle, {'class': 'catToggleBtn'}, {'class': 'tarteaucitronPlus'})
                ).closest('li') // Return to parent li
                .appendChild(this.#createElement('div', null, {
                    'id': 'services_mandatory',
                }))
                .appendChild(this.#createElement('div', null, {
                    'class': 'line'
                }))
                .appendChild(this.#createElement('div', null, {
                    'class': 'name',
                }))
                .appendChild(this.#createElement('div', null, {
                    'role': 'heading',
                    'aria-level': '3',
                    'class': 'tacH3',
                }, lang.mandatoryText)).parentNode // return to name
                .appendChild(this.#createElement('div', null, {
                    'class': 'listCookie',
                })).parentNode.parentNode // Return to .line div
                .appendChild(this.#createElement('div', null, {
                    'class': 'ask',
                }))
                .appendChild(this.#createButton(true, lang.allow, {
                    'disabled': 'disabled'
                }))
            ;
        }

        // Create line per category
        let toggleFn = this.#uiToggle;
        for (i = 0; i < cat.length; i += 1) {

            let toggleBtn = this.#createButton(true, lang[cat[i]].title, {
                'class': 'catToggleBtn',
                'data-cat': 'tarteaucitronDetails' + cat[i]
            }, {'class': 'tarteaucitronPlus'})
            toggleBtn.addEventListener('click', function(event){
                toggleFn(event.target.dataset.cat, 'tarteaucitronInfoBox');
            })

            this
                .#createElement('li', catsUl, {
                    'id': 'servicesTitle_' + cat[i],
                    'class': 'catLine',
                })
                .appendChild(this.#createElement('div', null, {
                    'class': 'tarteaucitronTitle'
                }))
                .appendChild(toggleBtn)
                .closest('li') // Return to parent li
                .appendChild(this.#createElement('div', null, {
                    'id': 'tarteaucitronDetails' + cat[i],
                    'class': 'tarteaucitronDetails infoBox',
                }, lang[cat[i]].details))

                .parentNode
                .appendChild(this.#createElement('ul', null, {
                    'id': 'services_' + cat[i],
                    'class': 'servicesCtn' + (this.#options.groupServices === false ? ' show' : ''),
                }))
            ;
        }

        this.#createElement('li', catsUl, {
            'id': 'tacNoServicesTitle',
            'class': 'line',
        }, lang.noServices);


        if(this.#options.removeCredit === false) {
            this
                .#createElement('a', catsUl, {
                    'class': 'selfLink',
                    'href': 'https://tarteaucitron.io/',
                    'rel': 'rel="nofollow noreferrer noopener',
                    'target': '_blank',
                    'title': 'tarteaucitron ' + lang.newWindow,
                })
                .appendChild(this.#createElement('img',null, {
                    'src': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHcAAAAeCAYAAAAWwoEYAAADl0lEQVRoge1Y0W3bQAx9CjKARlC+9GVUmqDJBHEmiDyB6wkcTxBngtgTxJ0gzgQW4C/9aYOmE6g4lTQo+k6y3Rb94QOERNQd+cjj8XiGwWAwGAwGg8FgMBgMBoPB8F8RNRXe+whEKe7c36ZCAeCRxC9Rig2PUd8kPgAsoxSfQ3YAzAA8D/HwYYCb05kBKKO0teFkmbC1jlKsAnq/Abjn+QBqAIsoRS30ttwG/HNz1wH/XIxWTicLdvtW7xTAGEAMtP685CNsBTe2d/BLydfXAG57SEnMAST0zgYZSUCPk02bCvkJduIzuJzDLfPolbY+tLKmar+/8+IRePy4qdpE03qHuH8fipFb4N2+XdA3AJ/0vaQxt7s9FvkIS2XvtqnwM0rxpOQfbnE5G2LhTCmUO2fHIngOmcv+KG3HafDchB6ntwjYqenR2PqC7sOZ3E7FXHB0vqxoFyUyLh7OEH7LOGouvhhN3eIBeKXv0n5MsufdHqXcwYR5U2EbpV35lSspVPJmQj4TcgRK7jTg5IzmPUhhwM5a2WHUFCx+NgiDucmgh7idikLovHFlL0pxQ9xzX+IIP9Y6FrJsqhjlQpZRAkFVDCjZfcCHt6bqJDmuh5ylCWx0RVnk3oumaknqTH5sqrY0fBWyULaHUIgAgxb46MxV3DbieAhxOxUxjSuljig9lMQ/Bcfoi9BTEv9aLORSndVxYOH525sUDC6u2gWxcNzBNRxPanyh3ktKinOgy3WoxPbtUM0t6RkbQnzBnFPgi9GCOEubY9UffIryz9iKRe8s/FUfEWosJJGxagp85bpUO3VywQ46lOtAWfNxKwa4JXQ+628+bpxYGXXMzp5rXH401VEyXwIdowXFaKWSMFHvMTVmGnc+P3oXV2QOiBCfgex8QtcQCbcQE/H+eoHzrkFo1KM7zVO4jVVj5s6lRiWF7zyXyfRMc97J3tzj87mYqZ7E2YjzUct9GUi4tjHLR8dVkBLjQcuHFleWvQfRNEhFR7uX7pkctOwvZXsft7sAtyldEUIN2UTeLxnEfxKYswzdi88BdbZ8hifUoSMftQvP+muRwN6+Q3DeqqRExP9QmTtcheiHh0Ot1x2i2km1bP9pbufw5zZdyWsOrh7vQae5OZWbsMv30pi7cd/CKj3coPEVaCP4Zhx4eQWhOZ1Y9MTXGyP8/iGjEyfa1T4fO/4Lea9vBoPBYDAYDAaDwWAwGAwGwz8GgF8siXCCbrSRhgAAAABJRU5ErkJggg==',
                    'alt': 'tarteaucitron.io',
                } ))
            ;
        }

        // Alert
        let tacAlertBig = this.#createElement('div', tacRoot, {
            'tabindex': '-1',
            'id': 'alertBig',
            'class': 'alertBig alertBig' + orientation,
        })

        if (this.#options.closePopup === true) {

            let closeElement = this.#createElement('div', tacAlertBig, {
                'class': 'closeCross',
                'title': lang.allowAll,
                'data-state': true,
            }, 'X');
            closeElement.addEventListener('click', this.#uiRespondAll);
        }

        this.#createElement('div', tacAlertBig, {
            'class': 'beforeDisclaimer'
        }, lang.middleBarHead)

        tacAlertBig.appendChild(
            this.#createElement('div', null, {
                'class': 'disclaimerAlert',
                'id': 'disclaimerAlert',
            }, lang.alertBigPrivacy))
        ;

        if(!this.#options.acceptAllCta){
            // Show only one personalize button
            this.#createElement('button', tacAlertBig, {
                'type': 'button',
                'class': 'personalize',
                'aria-label': lang.personalize + ' ' + lang.modalWindow,
                'title': lang.personalize + ' ' + lang.modalWindow,
                'data-state': false,
            }, lang.personalize)
                .addEventListener('click', this.#uiOpenPanel);

        } else {
            let askContainer = this.#createElement('div', tacAlertBig, {
                'class': 'askContainer',
            });

            let askBtnContainer = this.#createElement('div', askContainer, {
                'class': 'askBtnContainer',
            });
            let acceptAll = this.#createButton(true, lang.acceptAll, {
                'class': 'ctaBtn btnAllow',
                'data-state': true,
            }, )
            askBtnContainer.appendChild(acceptAll);
            acceptAll.addEventListener('click', this.#uiRespondAll);

            if (this.#options.denyAllCta) {
                let denyAllCta = this.#createButton(false, lang.denyAll, {
                    'class': 'ctaBtn btnDeny allDenied',
                    'data-state': false,
                });

                denyAllCta.addEventListener('click', this.#uiRespondAll);

                if(this.#options.reloadThePage){
                    this.#addAttributes(denyAllCta, {
                        'aria-label':  lang.denyAll + ' (' + lang.reload + ')',
                        'title':  lang.denyAll + ' (' + lang.reload + ')',
                    });
                }
                askBtnContainer.appendChild(denyAllCta);
            }

            let optLine = this.#createElement('div', askContainer, {
                'class': 'optLine',
            });
            this.#createElement('button', optLine, {
                'class': 'ctaBtn personalize',
                'aria-label': lang.personalize + ' ' + lang.modalWindow,
                'title': lang.personalize + ' ' + lang.modalWindow,
            }, lang.personalize)
                .addEventListener('click', this.#uiOpenPanel)

            if (this.#options.privacyUrl !== null && this.#options.privacyUrl !== "") {
                this.#createElement('button', optLine, {
                    'type': 'button',
                    'class': 'ctaBtn privacyUrl',
                    'role': 'link',

                }, lang.privacyUrl)
                    .addEventListener('click', this.#redirectToPrivacy);
            }
        }

        if (this.#options.showIcon === true) {
            let iconBtn = this.#createElement('div', null, {
                'class': 'manager',
            });
            iconBtn.appendChild(this.#createElement('img', null, {
                'src': this.#options.iconSrc ? this.#options.iconSrc : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAGA0lEQVRoge1a207bWBRdBtJwLYZhKDMVmlSK1LxNkPo+ZH6g8B6p5AuALwC+APoFoVLeoT8whPeRSt+CZKmZVu3AiIsRlEtCktGyjy8xzuXYhvahS0JJHJ/4rLP3XnuffcAPfGdQ7mM6jRLSAF4BxqsbewB2lRS2o35mpEQaJcwCyANIdLi1DGBNSWEzqmdHRqRRwjqAJclhtExOSUEP+/xIiDRKhhUWfL7ShTtBuJnqcw+/z4Ql0xNmMEwSSz4kuNIzSgpjSsqYJP/GeE185wYJroedRyiLNEpGLLzzrHSuk+83SgbxvOcyyRaDziWsRVZkSRDinpzPbwVGWIucuohsKynMS47fAQyls/BMSRmKJo3AFhG5wm2N1wF+Zs3zebbFfR0RxrXcJHQlgH+LMW616pR/WiIMEXfW3mtzXyeEGWsjKot8c4TOI98L+iKaR5PS6IUk88RLAO9F8UjrbYoYMOosNavpfmODIiwRXRR/G3ohaWVo1RU/c30jV8ab2mV8qVGzHWBOLyTLZiWs5Rolg/C3ySOi0tXP/k4aEwOwSBKPJs7Rp16ABJTe+p1xVX0It/owqqdDEMRoqd3RFxqDPh20Ig6VEPVC0i5RSCD+6wl6HlW7GksSlUMV11/GrUs5NasFLusDE9ELSVphXemtJwaT/8JyIRvxNNCfBmIiNdR04LII3DSrbe0yjqvyJF/ppptqVlt+MCLCEh/oOkPPP6N38Mb5cnQBGFsEqmXg5j3QMwoMzwGnr4HYbybBq13gZAOom/FO63zdf2qQArCsZrUN2TlJy69eSDKYV+6Q4MpP75ivHzPA53ngaBW4eGuSOt0A/lsGPmXMz0+3TFJcTfFbPfFbfnwlhON+iQhlWmA82CQ4ocQ7c6KcfL3DHuls0yT6Sx4YnLXJDCQOIRRv5yGIJBgP8Sdisj2qubpc5UGJmo+W49ifVmzL8HcpGhQPvZCUKiCliIhEN0tr2OCqHuSA8gwQ/92MkU7gxEmeVqGrTTgpxPXbUrtGWYus0I9thRIraagRQUIDf7Qn4yZhKRiFQIyhfMfUr3yblokVWSJ6k8xSnc7eNN/RjowfCYiFoDUFer1S3gW6JiJ8Nt30EMbEhU+vzSIztuRYjRLsR8IHLjlf7HZ+MrWWEXxNmbvapt4jGSqZRYSkGUetSNTPzHsui5YMQ2ajJUNks6mw4wT54Ok2ShnzzIPCUGshzawCRKy5FqvrTZe0RWzQGvw79m67XZjKmxJrLsICjtZa55gxXy+6F4sYsEtxTqhXdRTLC8ulSDaWoCLsolfN+8YUhOsJV709H7Cudr0LlVEtzqBcN+shEyThdR941OnAbF8pirKJqXyupTRTtQSReiVmXW1j7oBErB0d9xM2WEd5J9ZKYtuR4WKwwBSoORbpGrJ5ZI9lt71irJmGX1px0JYE26uNErawr2zfIcP4OHEKXm66PA3wjpCNEfpJunI4muifPjKvsFCkGjExTq63yxMJsZNMYF/J4HmDC5A3Yq36jy0ClePHVhwuu/b1HSFlEfHD5ZtD1bEK44Qu1mWys6tbWmZyPWckzlPTGiRw/XHCuk+q4Rek+mVrVL/UppwrdDEGNV2kpyuhccgc5Oxm9vWnn+19vJrVpLor0kTUrGacMplb1CfOFyTD4o9uNrHqr2Z+ZMSp1c2XcVSORnh9Q81q3k599ETgkNnjg0nGzi10K7rX+bZpHbrblPcY5A4Zxk2xcjzCvTpd9027Aa0QtouyyrKFRR6D/04DwkFGvHPXM3Qda/Jb4nPgI7hQLVM1q5HIBt2MzQNa57Z1DiiLAGa5Mi+O4Sz3Mpp6laPHO6InII3ITnX1QtI+EOX+m9ZxleOZ/j9PiuKoLi3aqXPuEoSye/Vhkm+LalbLtHhMS0R6zu7aZ3vP2jOjL7QVv4McxhcDnZIelAQibGIbULOapf3PuE1Vs9qeaOTdkVKr00gCQiw4NlBzDvf1Lxx+uP5r3Dgv5KQZRzWn+GRwz8jmDS8itUg7iB6vLuJCF5Uty4A9mVKkFR6MiJDachST/oHvHgD+B4SoUIitpF05AAAAAElFTkSuQmCC',
                'alt': lang.icon + ' ' + lang.modalWindow,
                'title': lang.icon + ' ' + lang.modalWindow,
            }));
            this.#createElement('div', tacRoot, {
                'id': 'tacIcon',
                'class': 'tacIcon icon' + this.#options.iconPosition,
            }).appendChild(iconBtn);
            iconBtn.addEventListener('click', this.#uiOpenAlert);
        }

        if (this.#options.showAlertSmall === true) {
            let tacSmall = this.#createElement('div', tacRoot, {
                'id': 'alertSmall',
                'class': ' alertSmall alertSmall' + orientation,
            });
            let managerDiv = this.#createElement('div', tacSmall, {
                'class': 'managerCtn',
            });
            let tacManager = this.#createElement('div', managerDiv, {
                'id': 'tarteaucitronManager',
                'class': 'manager',
                'alt': lang.alertSmall + ' ' + lang.modalWindow,
                'title': lang.alertSmall + ' ' + lang.modalWindow,
            }, lang.alertSmall);
            tacManager.addEventListener('click', this.#uiOpenPanel);

            let tacDot = this.#createElement('div', tacManager, {
                'id': 'tacDot',
            });

            this.#createElement('div', tacDot, {
                'id': 'tacDotGreen',
            });
            this.#createElement('div', tacDot, {
                'id': 'tacDotYellow',
            });
            this.#createElement('div', tacDot, {
                'id': 'tacDotRed',
            });

            if(this.#options.cookiesList === true){
                this.#createElement('button', managerDiv, {
                    'id': 'cookieNumber',
                    'aria-expanded': 'false',
                    'aria-controls': 'clCtn',
                    'type': 'button',
                }, '0').addEventListener('click', this.#uiToggleCookiesList);

                let tacListContainer = this.#createElement('div', tacSmall, {
                    'id': 'clCtn',
                });
                /*let closeButton = this.#createElement('button', tacListContainer, {
                    'id': 'tarteaucitronClosePanelCookie',
                }, lang.close);

                if(this.#options.reloadThePage){
                    this.#addAttributes(closeButton, {
                        'aria-label' : lang.close + ' (' + lang.reload + ')',
                        'title' : lang.close + ' (' + lang.reload + ')',
                    })
                }*/

                this.#createElement('div', tacListContainer, {
                    'class': 'cookieNumber',
                    'role': 'heading',
                    'aria-level': '2',
                    'id': 'cookieNumberBis'
                }, '0 cookie');
                this.#createElement('div', tacListContainer, {
                    'id': 'tarteaucitronCookiesList',
                });
            }
        }

        if (this.#options.noAdsBlocker === true) {
            let tacRootAvailableEvent = new Event("tac.root_available");
            window.dispatchEvent(tacRootAvailableEvent);

            if (document.location.hash === this.#options.hashtag && this.#options.hashtag !== '') {
                this.#uiOpenPanel();
            }

            this.#cookieNumber();
        }

        if (this.#options.groupServices === true) {
            //let cats = document.querySelectorAll('[id^="servicesTitle_"]');
            let cats = document.querySelectorAll('.catLine');

            for(i=0; i < cats.length; i++){
                let item = cats[i];

                let cat = item.getAttribute('id').replace(/^(servicesTitle_)/, "");
                if(cat === 'mandatory'){
                    continue;
                }

                let ul = this.#createElement('ul', null, {});
                let line = this.#createElement('li', ul, {
                    'class': 'line',
                });

                let name = this.#createElement('div', line, {
                    'class': 'name',
                });
                this.#createElement('div', name, {
                        'class': 'tacH3',
                        'role': 'heading',
                        'aria-level': '2',
                    }, lang[cat].title
                );
                this.#createElement('span', name, {}, lang[cat].details);


                let toggle = this.#createElement('div', name, {
                    'aria-expanded': false,
                    'class': 'tacToggleGroupe',
                    'data-cat': 'cat',
                    'id': 'tacToggleGroupe-' + cat
                }, lang.alertSmall + ' (' + document.getElementById("services_" + cat).childElementCount + ')')

                let ask = this.#createElement('div', line, {
                    'class': 'ask',
                    'id': 'group'+cat,
                });

                let allow = this.#createButton(true, lang.allow, {
                    'aria-label': lang.allow + ' ' + lang[cat].title,
                    'id': 'accept-group-'+cat,
                    'data-state': true,
                    'data-type': cat,
                });

                let deny = this.#createButton(false, lang.deny, {
                    'aria-label': lang.deny + ' ' + lang[cat].title,
                    'id': 'reject-group-'+cat,
                    'data-state': false,
                    'data-type': cat,
                });

                allow.addEventListener('click', this.#uiRespondAll);
                deny.addEventListener('click', this.#uiRespondAll);

                ask.appendChild(allow);
                ask.appendChild(deny);

                let uiToggle = this.#uiToggle,
                    uiAddClass = this.#uiAddClass,
                    uiRemoveClass = this.#uiRemoveClass;

                toggle.addEventListener('click', function () {
                    uiToggle('services_' + cat);

                    if (document.getElementById('services_' + cat).classList.contains('show')) {
                        uiAddClass('servicesTitle_' + cat, 'tacIsExpanded');
                        document.getElementById('tacToggleGroupe-' + cat).setAttribute('aria-expanded', 'true');
                    } else {
                        uiRemoveClass('servicesTitle_' + cat, 'tacIsExpanded');
                        document.getElementById('tacToggleGroupe-' + cat).setAttribute('aria-expanded', 'false');
                    }

                    console.log(document.getElementById('services_' + cat));
                });

                item.insertBefore(ul, item.querySelector('#services_' + cat + ''));
                this.#uiAddClass('#services_' + cat, 'hide');
            }
        }
        this.#uiColor("", true);

        if (this.events.load) {
            this.events.load();
        }
    }

    pushJob = (id, options) => {
        console.log('Push new job: ' + id);

        if (this.job.indexOf(id) === -1) {
            this.job.push(id);
        }

        this.#launch[id] = false;
        this.#addService(id, options);
    }

    #addService = (serviceId, options) => {
        if(!services[serviceId]){
            console.error('Unknown services id: ' + serviceId);
            return;
        }

        let service = services[serviceId],
            cookie = this.#cookieRead(),
            hostname = document.location.hostname,
            hostRef = document.referrer.split('/')[2],
            isNavigating = (hostRef === hostname && window.location.href !== this.#options.privacyUrl),
            isAutostart = (!service.needConsent),
            isWaiting = (cookie.indexOf(service.key + '=wait') >= 0),
            isDenied = (cookie.indexOf(service.key + '=false') >= 0),
            isAllowed = ((cookie.indexOf(service.key + '=true') >= 0) || (!service.needConsent && cookie.indexOf(service.key + '=false') < 0)),
            isResponded = (cookie.indexOf(service.key + '=false') >= 0 || cookie.indexOf(service.key + '=true') >= 0),
            isDNTRequested = (navigator.doNotTrack === "1" || navigator.doNotTrack === "yes" || navigator.msDoNotTrack === "1" || window.doNotTrack === "1");

        if (this.#added[service.key] !== true) {
            this.#added[service.key] = true;
            service.options = options;
            let line = this.#createElement('li', null, {
                    'id': service.key + 'Line',
                    'class': 'line'
                }),
                name = this.#createElement('div', line, {
                    'class': 'name',
                });
            this.#createElement('div', name, {
                'class': 'tacH3',
                'role': 'heading',
                'aria-level': '3',
            }, service.name);
            this.#createElement('div', name, {
                'id': 'tacCL' + service.key,
                'class': 'listCookie',
            });

            if (this.#options.moreInfoLink === true) {

                let link = 'https://tarteaucitron.io/service/' + service.key + '/';
                if (service.readmoreLink !== undefined && service.readmoreLink !== '') {
                    link = service.readmoreLink;
                }
                if (this.#options.readmoreLink !== undefined && this.#options.readmoreLink !== '') {
                    link = this.#options.readmoreLink;
                }
                this.#createElement('a', name, {
                    'href': link,
                    'target': '_blank',
                    'rel': 'noreferrer noopener nofollow',
                    'title': this.#lang.cookieDetail + ' ' + service.name + ' ' + this.#lang.ourSite + ' ' + this.#lang.newWindow,
                    'class': 'readMoreInfo',
                }, this.#lang.more);
                this.#createElement('span', name, {
                    'class': 'readMoreSeparator',
                }, '-');

                this.#createElement('a', name, {
                    'href': service.uri,
                    'target': '_blank',
                    'rel': 'noreferrer noopener',
                    'title': this.#lang.source + ' ' + service.name + ' ' + this.#lang.newWindow,
                    'class': 'readMoreOfficial',
                }, this.#lang.source);
            }

            let ask = this.#createElement('div', line, {
                    'class': 'ask',
                }),
                allow = this.#createButton(true, this.#lang.allow, {
                    'aria-label': this.#lang.allow + ' ' + service.name,
                    'id': service.key + 'Allowed',
                    'data-key': service.key,
                    'data-state': true,
                }),
                deny = this.#createButton(false, this.#lang.deny, {
                    'aria-label': this.#lang.deny + ' ' + service.name,
                    'id': service.key + 'Denied',
                    'data-key': service.key,
                    'data-state': false,
                });

            allow.addEventListener('click', this.#uiRespond);
            deny.addEventListener('click', this.#uiRespond);

            ask.appendChild(allow);
            ask.appendChild(deny);


            this.#uiAddClass('servicesTitle_' + service.type, 'show');

            if (document.getElementById('services_' + service.type) === null) {
                return;
            }
            document.getElementById('services_' + service.type).appendChild(line);

            if(this.#options.groupServices === true){
                document.getElementById('tacToggleGroupe-' + service.type)
                    .innerHTML = this.#lang.alertSmall + ' (' +
                    document.getElementById('services_' + service.type).childElementCount +
                    ')';
            }

            this.#uiAddClass('tacNoServicesTitle', 'hide');

            this.#cookieCheckCount(service.key);
            this.#sendEvent(service.key + '_added')

        }

        // Default not EU resident, allow cookie
        if (isResponded === false && this.user.byPass === true) {
            isAllowed = true;
            this.#cookieCreate(service.key, true);
        }

        if ((!isResponded && (isAutostart || (isNavigating && isWaiting))) || isAllowed) {
            if (!isAllowed || (!service.needConsent && cookie.indexOf(service.key + '=false') < 0)) {
                this.#cookieCreate(service.key, true);
            }
            if (this.#launch[service.key] !== true) {
                this.#launch[service.key] = true;
                // Todo check to remove engage div
                service.js(options);
                this.#sendEvent(service.key + '_loaded');
            }
            this.#state[service.key] = true;
            this.#uiColor(service.key, true);
        } else if (isDenied) {
            if (typeof service.fallback === 'function') {
                service.fallback(this.#engage(serviceId));
            }
            this.#state[service.key] = false;
            this.#uiColor(service.key, false);

        } else if (!isResponded && isDNTRequested) {
            this.#cookieCreate(service.key, 'false');

            if (typeof service.fallback === 'function') {
                service.fallback(this.#engage(serviceId));
            }

            this.#state[service.key] = false;
            this.#uiColor(service.key, false);
        } else if (!isResponded) {
            this.#cookieCreate(service.key, 'wait');

            if (typeof service.fallback === 'function') {
                service.fallback(this.#engage(serviceId));
            }

            this.#uiColor(service.key, 'wait');
            this.#uiOpenAlert();
        }

        this.#cookieCheckCount(service.key);
        this.#sendEvent(service.key + '_added');
    }

    #sendEvent = (event_key) => {
        if(event_key !== undefined) {
            document.dispatchEvent(new Event(event_key));
        }
    }

    #uiCss = (id, property, value) => {
        //console.log('Css change', id, property, value);
        if (document.getElementById(id) !== null) {

            if (property === 'display' && value === 'none' && ['back'].includes(id)) {
                document.getElementById(id).style['opacity'] = '0';

                setTimeout(function() {document.getElementById(id).style[property] = value;}, 200);
            } else {

                document.getElementById(id).style[property] = value;

                if (property === 'display' && value === 'block' && ['tarteaucitron', 'alertBig'].includes(id)) {
                    document.getElementById(id).style['opacity'] = '0';
                    setTimeout(function() {document.getElementById(id).style['opacity'] = '1';}, 1);
                }

                if (property === 'display' && value === 'block' && id === 'back') {
                    document.getElementById(id).style['opacity'] = '0';
                    setTimeout(function() {document.getElementById(id).style['opacity'] = '0.7';}, 1);
                }
            }
        }
    }

    #uiAddClass = (id, className) => {

        if (document.getElementById(id) !== null && document.getElementById(id).classList !== undefined) {
            document.getElementById(id).classList.add(className);
        } else {
            let elems = document.getElementsByClassName(id);
            for(let i = 0; i < elems.length; i++){
                if(elems[i].classList !== undefined){
                    elems[i].classList.add(className);
                }
            }
        }
    }

    #uiRemoveClass = (id, className) => {
        if (document.getElementById(id) !== null && document.getElementById(id).classList !== undefined) {
            document.getElementById(id).classList.remove(className);
        } else {
            let elems = document.getElementsByClassName(id);
            for(let i = 0; i < elems.length; i++){
                if(elems[i].classList !== undefined){
                    elems[i].classList.remove(className);
                }
            }
        }
    }

    #uiRespondAll = (event) => {
        let service,
            key,
            index = 0,
            status = event.target.dataset.state === 'true',
            type = event.target.dataset.type,
            allowSafeAnalytics = event.target.dataset.safe !== null;

        for (index; index < this.job.length; index += 1) {
            if (typeof type !== 'undefined' && type !== '' && services[this.job[index]].type !== type) {
                continue;
            }

            if (allowSafeAnalytics && typeof services[this.job[index]].safeanalytic !== "undefined" && services[this.job[index]].safeanalytic === true) {
                continue;
            }

            service = services[this.job[index]];
            key = service.key;
            if (this.#state[key] !== status) {
                if (status === false && this.#launch[key] === true) {
                    if (TarteAuCitron.checkIfExist('closePanel')) {
                        let ariaCloseValue = document.getElementById('closePanel').textContent.trim() + ' (' + this.#lang.reload + ')';
                        document.getElementById('closePanel').setAttribute("aria-label", ariaCloseValue);
                        document.getElementById('closePanel').setAttribute("title", ariaCloseValue);
                    }
                }
                if (this.#launch[key] !== true && status === true) {

                    this.#launch[key] = true;
                    if (typeof services[key].js === 'function') {
                        services[key].js();
                    }
                    this.#sendEvent(key + '_loaded');
                }

                this.#state[key] = status;
                this.#cookieCreate(key, status);
            }
            this.#uiColor(key, status);
        }

        if (this.#options.reloadThePage === true) {
            window.location.reload();
        }
    }

    #uiRespond = (event) => {
        let key = event.target.dataset.key,
            state = event.target.dataset.state === 'true';

        if(key === undefined){
            return;
        }

        console.log('Respond for ' + key + ' state : ' + (state ? 'Yes': 'No') + ' State = ', this.#state[key]);

        // return if same state
        if (this.#state[key] === state) {
            return;
        }

        if (state === false && this.#launch[key] === true && TarteAuCitron.checkIfExist('closePanel')) {
            let ariaCloseValue = document.getElementById('closePanel').textContent.trim() + ' (' + this.#lang.reload + ')';
            document.getElementById('closePanel').setAttribute("aria-label", ariaCloseValue);
            document.getElementById('closePanel').setAttribute("title", ariaCloseValue);
        }

        // if not already launched... launch the service
        if (state === true && this.#launch[key] !== true) {
            this.#launch[key] = true;
            services[key].js();
            this.#sendEvent(key + '_loaded');
        }

        // If already launch and refuse cookie, call fallback
        if(state === false && this.#launch[key] === true){
            this.#launch[key] = false;
            if(typeof services[key].fallback === "function"){
                services[key].fallback(this.#engage(key));
            }
            this.#sendEvent(key + '_unloaded');
        }

        this.#state[key] = state;
        this.#cookieCreate(key, state);
        this.#uiColor(key, state);
    }

    #uiColor = (key, status) => {
        let c = 'tarteaucitron',
            nbDenied = 0,
            nbPending = 0,
            nbAllowed = 0,
            sum = this.job.length,
            index;

        if (key !== "") {
            if (status === true) {
                this.#uiAddClass(key + 'Line', 'isAllowed');
                this.#uiRemoveClass(key + 'Line', 'isDenied');
                document.getElementById(key + 'Allowed').setAttribute('aria-pressed', 'true');
                document.getElementById(key + 'Denied').setAttribute('aria-pressed', 'false');
            } else if (status === false) {
                this.#uiRemoveClass(key + 'Line', 'isAllowed');
                this.#uiAddClass(key + 'Line', 'isDenied');
                document.getElementById(key + 'Allowed').setAttribute('aria-pressed', 'false');
                document.getElementById(key + 'Denied').setAttribute('aria-pressed', 'true');
            } else {
                document.getElementById(key + 'Allowed').setAttribute('aria-pressed', 'false');
                document.getElementById(key + 'Denied').setAttribute('aria-pressed', 'false');
            }

            // check if all services are allowed
            let sumToRemove = 0;

            for (index = 0; index < sum; index += 1) {

                if (typeof services[this.job[index]].safeanalytic !== "undefined" && services[this.job[index]].safeanalytic === true) {
                    sumToRemove += 1;
                    continue;
                }

                if (this.#state[this.job[index]] === false) {
                    nbDenied += 1;
                } else if (this.#state[this.job[index]] === undefined) {
                    nbPending += 1;
                } else if (this.#state[this.job[index]] === true) {
                    nbAllowed += 1;
                }
            }
            sum -= sumToRemove;

            this.#uiCss('tacDotGreen', 'width', ((100 / sum) * nbAllowed) + '%');
            this.#uiCss('tacDotYellow', 'width', ((100 / sum) * nbPending) + '%');
            this.#uiCss('tacDotRed', 'width', ((100 / sum) * nbDenied) + '%');

            if (nbDenied === 0 && nbPending === 0) {
                this.#uiRemoveClass('allDenied', c + 'IsSelected');
                this.#uiAddClass('allAllowed', c + 'IsSelected');

                this.#uiAddClass(c + 'MainLineOffset', c + 'IsAllowed');
                this.#uiRemoveClass(c + 'MainLineOffset', c + 'IsDenied');

                document.getElementById('allDenied').setAttribute('aria-pressed', 'false');
                document.getElementById('allAllowed').setAttribute('aria-pressed', 'true');

            } else if (nbAllowed === 0 && nbPending === 0) {
                this.#uiRemoveClass('allAllowed', c + 'IsSelected');
                this.#uiAddClass('allDenied', c + 'IsSelected');

                this.#uiRemoveClass(c + 'MainLineOffset', c + 'IsAllowed');
                this.#uiAddClass(c + 'MainLineOffset', c + 'IsDenied');

                document.getElementById('allDenied').setAttribute('aria-pressed', 'true');
                document.getElementById('allAllowed').setAttribute('aria-pressed', 'false');

            } else {
                this.#uiRemoveClass('allAllowed', c + 'IsSelected');
                this.#uiRemoveClass('allDenied', c + 'IsSelected');

                this.#uiRemoveClass(c + 'MainLineOffset', c + 'IsAllowed');
                this.#uiRemoveClass(c + 'MainLineOffset', c + 'IsDenied');

                document.getElementById('allDenied').setAttribute('aria-pressed', 'false');
                document.getElementById('allAllowed').setAttribute('aria-pressed', 'false');
            }

            // close the alert if all service have been reviewed
            if (nbPending === 0) {
                this.#uiCloseAlert();
            }

            if (services[key].cookies.length > 0 && status === false) {
                this.#cookiePurge(services[key].cookies);
            }

            //console.warn(key + ' - ' + status);

            if (status === true) {
                if (document.getElementById('tacCL' + key) !== null) {
                    document.getElementById('tacCL' + key).innerHTML = '...';
                }
                let checkCount = this.#cookieCheckCount;
                setTimeout(function () {
                    checkCount(key);
                }, 2500);
            } else {
                this.#cookieCheckCount(key);
            }
        }

        // groups
        let cats = document.querySelectorAll('[id^="servicesTitle_"]')
        let $this = this;
        Array.prototype.forEach.call(cats, function (item) {
            let cat = item.getAttribute('id').replace(/^(servicesTitle_)/, ""),
                total = document.getElementById("services_" + cat).childElementCount;
            let doc = document.getElementById("services_" + cat),
                groupDenied = 0,
                groupAllowed = 0;
            for (let ii = 0; ii < doc.children.length; ii++) {
                if (doc.children[ii].className === "line isDenied") {
                    groupDenied++;
                }
                if (doc.children[ii].className === "line isAllowed") {
                    groupAllowed++;
                }
            }
            if (total === groupAllowed) {
                $this.#uiRemoveClass('group' + cat, 'isDenied');
                $this.#uiAddClass('group' + cat, 'isAllowed');

                if (document.getElementById('reject-group-' + cat)) {
                    document.getElementById('reject-group-' + cat).setAttribute('aria-pressed', 'false');
                    document.getElementById('accept-group-' + cat).setAttribute('aria-pressed', 'true');
                }
            }
            if (total === groupDenied) {
                $this.#uiAddClass('group' + cat, 'isDenied');
                $this.#uiRemoveClass('group' + cat, 'isAllowed');

                if (document.getElementById('reject-group-' + cat)) {
                    document.getElementById('reject-group-' + cat).setAttribute('aria-pressed', 'true');
                    document.getElementById('accept-group-' + cat).setAttribute('aria-pressed', 'false');
                }
            }
            if (total !== groupDenied && total !== groupAllowed) {
                $this.#uiRemoveClass('group' + cat, 'isDenied');
                $this.#uiRemoveClass('group' + cat, 'isAllowed');

                if (document.getElementById('reject-group-' + cat)) {
                    document.getElementById('reject-group-' + cat).setAttribute('aria-pressed', 'false');
                    document.getElementById('accept-group-' + cat).setAttribute('aria-pressed', 'false');
                }
            }
        });
    }

    #uiOpenPanel = () => {
        // Hide
        this.#uiRemoveClass('alertBig', 'show');
        this.#uiRemoveClass('clCtn', 'show');

        // Show
        this.#uiAddClass('tarteaucitronRoot', 'show');
        this.#uiAddClass('tarteaucitronRoot', 'openPanel');
        this.#uiAddClass('tarteaucitron', 'show');
        this.#uiAddClass('tacBack', 'show');
        this.#uiAddClass('body', 'tarteaucitron-modal-open');

        let tacOpenPanelEvent = new Event("tac.open_panel");
        window.dispatchEvent(tacOpenPanelEvent);
    }

    #uiClosePanel = () => {
        if (document.location.hash === tarteaucitron.hashtag) {
            if (window.history) {
                window.history.replaceState('', document.title, window.location.pathname + window.location.search);
            } else {
                document.location.hash = '';
            }
        }

        this.#uiRemoveClass('tarteaucitronRoot', 'openPanel')

        console.log(TarteAuCitron.checkIfExist('tarteaucitron'));
        if (TarteAuCitron.checkIfExist('tarteaucitron')) {
            // accessibility: manage focus on close panel
            if (TarteAuCitron.checkIfExist('tarteaucitronCloseAlert')) {
                document.getElementById('tarteaucitronCloseAlert').focus();
            } else if (TarteAuCitron.checkIfExist('tarteaucitronManager')) {
                document.getElementById('tarteaucitronManager').focus();
            } else if (this.#options.customCloserId && TarteAuCitron.checkIfExist(this.#options.customCloserId)) {
                document.getElementById(this.#options.customCloserId).focus();
            }
            this.#uiRemoveClass('tarteaucitron', 'show');
            this.#uiRemoveClass('body', 'tarteaucitron-modal-open');
            this.#uiAddClass('alertBig', 'show');

            let sum = this.job.length, index = 0, nbPending = 0;

            for (index; index < sum; index += 1) {
                if (typeof services[this.job[index]].safeanalytic !== "undefined" && services[this.job[index]].safeanalytic === true) {
                    continue;
                }
                if (this.#state[this.job[index]] === undefined) {
                    nbPending += 1;
                }
            }
            if(nbPending === 0){
                this.#uiRemoveClass('tacBack', 'show');
                this.#uiRemoveClass('alertBig', 'show');
                this.#uiRemoveClass('tarteaucitronRoot', 'show')

                this.#uiRemoveClass('body', 'tarteaucitron-modal-open');

                this.#uiAddClass('alertSmall', 'show');
                this.#uiAddClass('tacIcon', 'show');
            } else {
                this.#uiAddClass('alertBig', 'show');
            }
        } else {
            console.log('OKLOKOK');
            this.#uiRemoveClass('tacBack', 'show')
            this.#uiRemoveClass('tarteaucitronRoot', 'show')
        }

        if (TarteAuCitron.checkIfExist('clCtn') && TarteAuCitron.checkIfExist('cookieNumber')) {
            // accessibility: manage focus on close cookies list
            document.getElementById('cookieNumber').focus();
            document.getElementById('cookieNumber').setAttribute("aria-expanded", "false");
            this.#uiRemoveClass('clCtn', 'show');
            //this.#uiCss('clCtn', 'display', 'none');
        }

        TarteAuCitron.fallback(['infoBox'], function (elem) {
            elem.classList.remove('show');
        }, true);

        if (this.#options.reloadThePage === true) {
            window.location.reload();
        } else {
            this.#uiCss('tacBack', 'display', 'none');
        }
        /*if (document.getElementsByTagName('body')[0].classList !== undefined) {
            document.getElementsByTagName('body')[0].classList.remove('tarteaucitron-modal-open');
        }*/

        let tacClosePanelEvent = new Event("tac.close_panel");

        window.dispatchEvent(tacClosePanelEvent);
    }

    #uiFocusTrap = () => {
        let focusableEls,
            firstFocusableEl,
            lastFocusableEl,
            filtered;

        focusableEls = document.getElementById('tarteaucitron').querySelectorAll('a[href], button');
        filtered = [];

        // get only visible items
        for (let i = 0, max = focusableEls.length; i < max; i++) {
            if (focusableEls[i].offsetHeight > 0) {
                filtered.push(focusableEls[i]);
            }
        }

        firstFocusableEl = filtered[0];
        lastFocusableEl = filtered[filtered.length - 1];

        //loop focus inside tarteaucitron
        document.getElementById('tarteaucitron').addEventListener("keydown", function (evt) {

            if (evt.key === 'Tab' || evt.keyCode === 9) {

                if (evt.shiftKey) /* shift + tab */ {
                    if (document.activeElement === firstFocusableEl) {
                        lastFocusableEl.focus();
                        evt.preventDefault();
                    }
                } else /* tab */ {
                    if (document.activeElement === lastFocusableEl) {
                        firstFocusableEl.focus();
                        evt.preventDefault();
                    }
                }
            }
        })
    }

    #uiOpenAlert = () => {
        // Hide
        this.#uiRemoveClass('percentage', 'show');
        this.#uiRemoveClass('tacIcon', 'show');
        this.#uiRemoveClass('alertSmall', 'show');

        // Show
        this.#uiAddClass('tarteaucitronRoot', 'show');
        this.#uiAddClass('tacBack', 'show');
        this.#uiAddClass('alertBig', 'show');
    }

    #uiCloseAlert = () => {
        this.#uiRemoveClass('tacIcon', 'show');
        this.#uiRemoveClass('tarteaucitronRoot', 'show');
        this.#uiRemoveClass('tarteaucitron', 'show');
        this.#uiRemoveClass('alertBig', 'show');
        this.#uiRemoveClass('percentage', 'show');
        this.#uiRemoveClass('tacBack', 'show');

        this.#uiAddClass('tacIcon', 'show');
        this.#uiAddClass('alertSmall', 'show');

        this.#cookieNumber();

        window.dispatchEvent(new Event("tac.close_alert"));
    }

    #uiToggleCookiesList = () => {
        let div = document.getElementById('clCtn'),
            togglediv = document.getElementById('cookieNumber');

        if (div === null) {
            return;
        }

        if (!div.classList.contains('show')) {
            this.#cookieNumber();

            this.#uiAddClass('clCtn', 'show');
            togglediv.setAttribute("aria-expanded", "true");
            this.#uiRemoveClass('tarteaucitron', 'show');
            this.#uiAddClass('tacBack', 'show');

        } else {
            togglediv.setAttribute("aria-expanded", "false");
            this.#uiRemoveClass('clCtn', 'show');
            this.#uiRemoveClass('tacBack', 'show');
            this.#uiRemoveClass('tarteaucitron', 'show');
        }
    }

    #uiToggle = (id, closeClass) => {
        let div = document.getElementById(id);

        if (div === null) {
            return;
        }
        //
        // if (closeClass !== undefined) {
        //     this.fallback([closeClass], function (elem) {
        //         console.log(elem);
        //         if (elem.id !== id) {
        //             elem.style.display = 'none';
        //         }
        //     }, true);
        // }

        div.classList.toggle('show');
    }

    #redirectToPrivacy = () => {
        document.location = this.#options.privacyUrl;
    }

    #cookieCreate = (key, status) => {

        let dayExpire = parseInt(this.#options.forceExpire) || 365,
            timeExpire = dayExpire * 86400000,
            d = new Date(),
            time = d.getTime(),
            expireTime = time + timeExpire, // 365 days by default
            regex = new RegExp("!" + key + "=(wait|true|false)", "g"),
            cookie = this.#cookieRead().replace(regex, ""),
            value = this.#options.cookieName + '=' + cookie + '!' + key + '=' + status,
            domain = (this.#options.cookieDomain !== null && this.#options.cookieDomain !== '') ? '; domain=' + this.#options.cookieDomain : '',
            secure = location.protocol === 'https:' ? '; Secure' : '';

        d.setTime(expireTime);
        document.cookie = value + '; expires=' + d.toGMTString() + '; path=/' + domain + secure + '; samesite=lax';
    }

    #cookieRead = () => {
        let nameEQ = this.#options.cookieName + "=",
            ca = document.cookie.split(';'),
            i,
            c;

        for (i = 0; i < ca.length; i += 1) {
            c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) === 0) {
                return c.substring(nameEQ.length, c.length);
            }
        }
        return '';
    }

    #cookiePurgeEvent = (event) =>  {
        let cookie = event.target.dataset.cookie;
        if(cookie !== undefined){
            this.#cookiePurge([cookie]);
        }
        location.reload();
    }

    #cookiePurge = (arr) => {
        let i;

        for (i = 0; i < arr.length; i += 1) {
            let rgxpCookie = new RegExp("^(.*;)?\\s*" + arr[i] + "\\s*=\\s*[^;]+(.*)?$");
            if (document.cookie.match(rgxpCookie)) {
                document.cookie = arr[i] + '=; expires=Thu, 01 Jan 2000 00:00:00 GMT; path=/;';
                document.cookie = arr[i] + '=; expires=Thu, 01 Jan 2000 00:00:00 GMT; path=/; domain=.' + location.hostname + ';';
                document.cookie = arr[i] + '=; expires=Thu, 01 Jan 2000 00:00:00 GMT; path=/; domain=.' + location.hostname.split('.').slice(-2).join('.') + ';';
            }
        }
    }

    #cookieCheckCount = (key) => {
        let cookies = services[key].cookies,
            nb = cookies.length,
            nbCurrent = 0,
            textContent = '',
            i,
            status = document.cookie.indexOf(key + '=true');

        if (status >= 0 && nb === 0) {
            textContent += this.#lang.useNoCookie;
        } else if (status >= 0) {
            for (i = 0; i < nb; i += 1) {

                if (document.cookie.indexOf(cookies[i] + '=') !== -1) {
                    nbCurrent += 1;
                    if (this.#cookieOwner[cookies[i]] === undefined) {
                        this.#cookieOwner[cookies[i]] = [];
                    }
                    if (this.#cookieCrossIndexOf(this.#cookieOwner[cookies[i]], services[key].name) === false) {
                        this.#cookieOwner[cookies[i]].push(services[key].name);
                    }
                }
            }

            if (nbCurrent > 0) {
                textContent += this.#lang.useCookieCurrent + ' ' + nbCurrent + ' cookie';
                if (nbCurrent > 1) {
                    textContent += 's';
                }
                textContent += '.';
            } else {
                textContent += this.#lang.useNoCookie;
            }
        } else if (nb === 0) {
            textContent = this.#lang.noCookie;
        } else {
            textContent += this.#lang.useCookie + ' ' + nb + ' cookie';
            if (nb > 1) {
                textContent += 's';
            }
            textContent += '.';
        }

        if (document.getElementById('tacCL' + key) !== null) {
            document.getElementById('tacCL' + key).innerHTML = textContent;
        }
    }

    #cookieCrossIndexOf = function (arr, match) {
        let i;
        for (i = 0; i < arr.length; i += 1) {
            if (arr[i] === match) {
                return true;
            }
        }
        return false;
    }

    #cookieNumber = () => {
        let cookies = document.cookie.split(';'),
            nb = (document.cookie !== '') ? cookies.length : 0,
            html = '',
            i,
            name,
            namea,
            nameb,
            c,
            d,
            s = (nb > 1) ? 's' : '',
            savedname = null,
            //cdn = path.split('/').slice(0, -1).join('/'),
            //regex = /^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i,
            host = window.location.hostname
        ;

        let cookieOwner = this.#cookieOwner

        cookies = cookies.sort(function (a, b) {
            namea = a.split('=', 1).toString().replace(/ /g, '');
            nameb = b.split('=', 1).toString().replace(/ /g, '');
            c = (cookieOwner[namea] !== undefined) ? cookieOwner[namea] : '0';
            d = (cookieOwner[nameb] !== undefined) ? cookieOwner[nameb] : '0';
            if (c + a > d + b) {
                return 1;
            }
            if (c + a < d + b) {
                return -1;
            }
            return 0;
        });
        let cookieLine = this.#createElement('div', null, {
                'class': 'clLine',
            }),
            cl = null
        ;

        if (document.cookie !== '') {
            for (i = 0; i < nb; i += 1) {
                let content = null,
                    name  = cookies[i].split('=', 1).toString().replace(/ /g, '');

                if (this.#cookieOwner[name] !== undefined && this.#cookieOwner[name].join(' // ') !== savedname) {
                    savedname = this.#cookieOwner[name].join(' // ');
                    this.#createElement('div', cookieLine, {
                        'class': 'title tacH3',
                        'role': 'heading',
                        'aria-level': 3,
                    }, this.#cookieOwner[name].join(' // '));

                    cl = this.#createElement('ul', cookieLine, {
                        'class': 'cookie-list',
                    })
                } else if (this.#cookieOwner[name] === undefined && host !== savedname) {
                    savedname = host;
                    this.#createElement('div', cookieLine, {
                        'class': 'title tacH3',
                        'role': 'heading',
                        'aria-level': 3,
                    }, host);

                    cl = this.#createElement('ul', cookieLine, {
                        'class': 'cookie-list',
                    })
                }

                let purge = this.#createElement('button', null, {
                    'class': 'purgeBtn',
                    'data-cookie': TarteAuCitron.fixSelfXSS(cookies[i].split('=', 1))
                }, '×');

                purge.addEventListener('click', this.#cookiePurgeEvent);

                this.#createElement('li', cl, {
                    'class': 'clMain',
                }).appendChild(this.#createElement('div', null, {
                    'class': 'clLeft',
                })).appendChild(purge).parentNode
                    .appendChild(this.#createElement('div', null, {
                        'class': 'cName'
                    }, TarteAuCitron.fixSelfXSS(name)))
                    .parentNode.parentNode
                    .appendChild(this.#createElement('div', null, {
                        'class': 'clRight',
                    }, TarteAuCitron.fixSelfXSS(cookies[i].split('=').slice(1).join('='))));

            }
        } else {
            cl = this.#createElement('ul', cookieLine, {
                'class': 'cookie-list',
            });
            this.#createElement('div', cl, {
                'class': 'clMain',
            }).appendChild(this.#createElement('div', null, {
                'class': 'clLeft',
            }))
                .appendChild(this.#createElement('div', null, {
                    'class': 'cName'
                }, '-'))
                .parentNode.parentNode
                .appendChild(this.#createElement('div', null, {
                    'class': 'clRight',
                }));
        }

        if (document.getElementById('tarteaucitronCookiesList') !== null) {
            document.getElementById('tarteaucitronCookiesList').innerHTML = html;
            document.getElementById('tarteaucitronCookiesList').appendChild(cookieLine);
        }

        if (document.getElementById('cookieNumber') !== null) {
            document.getElementById('cookieNumber').innerHTML = nb;
            document.getElementById('cookieNumber').setAttribute("aria-label", nb + ' cookie' + s + " - " + this.#lang.toggleInfoBox);
            document.getElementById('cookieNumber').setAttribute("title", nb + ' cookie' + s + " - " + this.#lang.toggleInfoBox);
        }

        if (document.getElementById('cookieNumberBis') !== null) {
            document.getElementById('cookieNumberBis').innerHTML = nb + ' cookie' + s;
        }

        for (i = 0; i < this.job.length; i += 1) {
            this.#cookieCheckCount(this.job[i]);
        }
    }

    static fixSelfXSS = (html) => {
        return html.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    static checkIfExist = (elemId) => {
        return document.getElementById(elemId) !== null && document.getElementById(elemId).offsetWidth !== 0 && document.getElementById(elemId).offsetHeight !== 0;
    }

    #engage = (id) => {
        let r = Math.floor(Math.random() * 100000),
            engage = services[id].name + ' ' + this.#lang.fallback;

        if (this.#lang['engage-' + id] !== undefined) {
            engage = this.#lang['engage-' + id];
        }

        let engageDiv = this.#createElement('div', null,{
            'class': 'tac_activate tac_activate_' + id,
        }, engage);
        let engageBtn = this.#createButton(true, this.#lang.allow, {
            'aria-label': this.#lang.allow,
            'id': 'Eng' + r + 'ed' + id,
            'data-key': id,
            'data-state': true,
        });
        engageBtn.addEventListener('click', this.#uiRespond)
        engageDiv.appendChild(engageBtn);

        return engageDiv;
    }

    #addOrUpdate = (source, custom) => {
        /**
         Utility function to Add or update the fields of obj1 with the ones in obj2
         */
        for(let key in custom){
            if(custom[key] instanceof Object){
                source[key] = this.#addOrUpdate(source[key], custom[key]);
            }else{
                source[key] = custom[key];
            }
        }
        return source;
    }

    #getLanguage() {
        let defaultLanguage = 'en';

        if (this.#options.forceLanguage !== '') {
            if (this.#availableLanguages.indexOf(this.#options.forceLanguage) !== -1) {
                return this.#options.forceLanguage;
            }
        }

        if (!navigator) { return defaultLanguage; }

        let lang = navigator.language ||  null,
            userLanguage = lang ? lang.substring(0, 2) : null;

        if (this.#availableLanguages.indexOf(userLanguage) === -1) {
            return defaultLanguage;
        }

        return userLanguage;
    }

    static addScript = (url, id, callback, execute, attrName, attrVal, internal) => {
        console.log('addScript', url, id, callback, execute, attrName, attrVal, internal);
        let script,
            done = false;

        if (execute === false) {
            if (typeof callback === 'function') {
                callback();
            }
        } else {
            script = document.createElement('script');
            script.id = (id !== undefined) ? id : '';
            script.async = true;
            script.src = url;

            if (attrName !== undefined && attrVal !== undefined) {
                script.setAttribute(attrName, attrVal);
            }

            if (typeof callback === 'function') {
                if (!internal ) {
                    script.onreadystatechange = script.onload = function () {
                        let state = script.readyState;
                        if (!done && (!state || /loaded|complete/.test(state))) {
                            done = true;
                            console.log('OK, on callback maintenant');
                            callback();
                        }
                    };
                } else {
                    callback();
                }
            }

            if (!internal) {
                console.warn('Append script');
                document.head.appendChild(script);
            }
        }
    }

    addService = (options) => {
        try{
            let key = options.key;
            services[key] = options;
        } catch (e) {
            console.log(e);
            console.error('key is not in options')
        }

    }

    static getElemWidth = (elem) => {
        return elem.getAttribute('width') || elem.clientWidth;
    }

    static getElemHeight = (elem) => {
        return elem.getAttribute('height') || elem.clientHeight;
    }

    static getElemAttr = (elem, attr) => {
        return elem.getAttribute('data-' + attr) || elem.getAttribute(attr);
    }

    async checkForAdBlocker() {
        let Blocked;

        async function Request() {
            try {
                return fetch(
                    "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js", {
                        method: 'HEAD',
                        mode: 'no-cors'
                    })
                    .then(function(response) {
                        // There is no AdBlocker
                        Blocked = true;

                        return Blocked;
                    }).catch(function(e) {
                        // Failed, Because of an AdBlocker
                        Blocked = false;

                        return Blocked;
                    });
            } catch (error) {
                Blocked = false;

                return Blocked;
            }
        }

        return Blocked !== undefined ? Blocked : await Request();
    }
}

export default TarteAuCitron;
