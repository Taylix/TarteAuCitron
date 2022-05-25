// generic iframe
import TarteAuCitron from "./TarteaucitronModule";

export let iframe = {
    "key": "iframe",
    "type": "other",
    "name": "Web content",
    "uri": "",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        TarteAuCitron.fallback(['tac_iframe'], function (x) {
            let frame_title = TarteAuCitron.fixSelfXSS(x.getAttribute("title")),
                width = x.getAttribute("width"),
                height = x.getAttribute("height"),
                allowfullscreen = x.getAttribute("allowfullscreen"),
                url = x.getAttribute("data-url");

            return '<iframe title="' + frame_title + '" src="' + url + '" width="' + width + '" height="' + height + '" scrolling="no" allowtransparency' + (allowfullscreen === '0' ? '' : ' webkitallowfullscreen mozallowfullscreen allowfullscreen') + '></iframe>';
        });
    },
    "fallback": function () {
        let id = 'iframe';
        TarteAuCitron.fallback(['tac_iframe'], function (elem) {
            elem.style.width = elem.getAttribute('width') + 'px';
            elem.style.height = elem.getAttribute('height') + 'px';
            return TarteAuCitron.engage(id);
        });
    }
};

// pinterestpixel
export let pinterestpixel = {
    "key": "pinterestpixel",
    "type": "ads",
    "name": "Pinterest Pixel",
    "uri": "https://help.pinterest.com/fr/business/article/track-conversions-with-pinterest-tag",
    "needConsent": true,
    "options": {},
    "cookies": ['_pinterest_sess', '_pinterest_ct', '_pinterest_ct_mw', '_pinterest_ct_rt', '_epik', '_derived_epik', '_pin_unauth', '_pinterest_ct_ua'],
    "js": function () {
        if (this.options.pinterestpixelId === undefined) {
            return;
        }

        if (!window.pintrk) {
            window.pintrk = function () {
                window.pintrk.queue.push(Array.prototype.slice.call(arguments));
            };

            let n = window.pintrk;
            n.queue = [];
            n.version = "3.0";

            TarteAuCitron.addScript('https://s.pinimg.com/ct/core.js', '', function () {
                window.pintrk('load', this.options.pinterestpixelId);
                window.pintrk('page');
            });
        }
    }
};

// elfsight
export let elfsight = {
    "key": "elfsight",
    "type": "support",
    "name": "Elfsight",
    "uri": "https://elfsight.com/privacy-policy/",
    "needConsent": true,
    "options": {},
    "cookies": ['__cfduid', '_p_hfp_client_id', 'session_id'],
    "js": function () {

        TarteAuCitron.addScript('https://apps.elfsight.com/p/platform.js');
    }
};

// plezi
export let plezi = {
    "key": "plezi",
    "type": "analytic",
    "name": "Plezi",
    "uri": "https://www.plezi.co/fr/mentions-legales/",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {

        if (this.options.pleziTenant === undefined || this.options.pleziTw === undefined) {
            return;
        }

        TarteAuCitron.addScript('https://app.plezi.co/scripts/ossleads_analytics.js?tenant=' + this.options.pleziTenant + '&tw=' + this.options.pleziTw);
    }
};


// smartsupp
export let smartsupp = {
    "key": "smartsupp",
    "type": "support",
    "name": "Smartsupp",
    "uri": "https://www.smartsupp.com/help/privacy/",
    "needConsent": true,
    "options": {},
    "cookies": ['ssupp.vid', 'ssupp.visits', 'AWSALB', 'AWSALBCORS'],
    "js": function () {

        if (this.options.smartsuppKey === undefined) {
            return;
        }

        window._smartsupp = window._smartsupp || {};
        window._smartsupp.key = this.options.smartsuppKey;
        window.smartsupp = function () {
            window.smartsupp._.push(arguments)
        };
        window.smartsupp._ = [];

        TarteAuCitron.addScript('https://www.smartsuppchat.com/loader.js');
    }
};



// sharpspring
export let sharpspring = {
    "key": "sharpspring",
    "type": "analytic",
    "name": "SharpSpring",
    "uri": "https://sharpspring.com/legal/sharpspring-cookie-policy/",
    "needConsent": true,
    "options": {},
    "cookies": ['koitk', '__ss', '__ss_tk', '__ss_referrer'],
    "js": function () {

        if (this.options.ssId === undefined || this.options.ssAccount === undefined) {
            return;
        }

        window._ss = window._ss || [];
        window._ss.push(['_setDomain', 'https://' + this.options.ssId + '.marketingautomation.services/net']);
        window._ss.push(['_setAccount', this.options.ssAccount]);
        window._ss.push(['_trackPageView']);

        window._pa = window._pa || {};

        TarteAuCitron.addScript('https://' + this.options.ssId + '.marketingautomation.services/client/ss.js');
    }
};

// pardot
export let pardot = {
    "key": "pardot",
    "type": "analytic",
    "name": "Pardot",
    "uri": "https://www.salesforce.com/company/privacy/full_privacy/",
    "needConsent": true,
    "options": {},
    "cookies": ['visitor_id'],
    "js": function () {
        if (this.options.piAId === undefined || this.options.piCId === undefined) {
            return;
        }

        window.piAId = this.options.piAId;
        window.piCId = this.options.piCId;
        window.piHostname = 'pi.pardot.com';

        TarteAuCitron.addScript('https://pi.pardot.com/pd.js');
    }
};

// Open Web Analytics
export let openwebanalytics = {
    "key": "openwebanalytics",
    "type": "analytic",
    "name": "Open Web Analytics",
    "uri": "",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {

        if (this.options.openwebanalyticsId === undefined || this.options.openwebanalyticsHost === undefined) {
            return;
        }

        window.owa_baseUrl = this.options.openwebanalyticsHost;
        window.owa_cmds = window.owa_cmds || [];
        window.owa_cmds.push(['setSiteId', this.options.openwebanalyticsId]);
        window.owa_cmds.push(['trackPageView']);
        window.owa_cmds.push(['trackClicks']);

        TarteAuCitron.addScript(window.owa_baseUrl + 'modules/base/js/owa.tracker-combined-min.js');
    }
};

// xandr universal pixel
// https://docs.xandr.com/bundle/invest_invest-standard/page/topics/universal-pixel-overview.html
export let xandr = {
    "key": "xandr",
    "type": "ads",
    "name": "Xandr (Universal)",
    "uri": "https://www.xandr.com/privacy/cookie-policy/",
    "needConsent": true,
    "options": {},
    "cookies": ['uuid2', 'uids', 'sess', 'icu', 'anj', 'usersync'],
    "js": function () {
        if (this.options.xandrId === undefined) {
            return;
        }

        if (!window.pixie) {
            let n = window.pixie = function (e, i, a) {
                n.actionQueue.push({
                    action: e,
                    actionValue: i,
                    params: a
                })
            };
            n.actionQueue = [];
        }

        TarteAuCitron.addScript('https://acdn.adnxs.com/dmp/up/pixie.js', '', function () {
            window.pixie('init', this.options.xandrId);
            window.pixie('event', 'PageView');
        });
    }
};

// xandr segment
// https://docs.xandr.com/bundle/invest_invest-standard/page/topics/segment-pixels-advanced.html
export let xandrsegment = {
    "key": "xandrsegment",
    "type": "ads",
    "name": "Xandr (Segment)",
    "uri": "https://www.xandr.com/privacy/cookie-policy/",
    "needConsent": true,
    "options": {},
    "cookies": ['uuid2', 'uids', 'sess', 'icu', 'anj', 'usersync'],
    "js": function () {
        let uniqIds = [],
            i,
            uri;

        TarteAuCitron.fallback(['xandrsegment-canvas'], function (x) {
            let uniqId = '_' + Math.random().toString(36).substr(2, 9);
            uniqIds.push(uniqId);
            return '<div id="' + uniqId + '" xandrsegmentAdd="' + x.getAttribute('xandrsegmentAdd') + '" xandrsegmentAddCode="' + x.getAttribute('xandrsegmentAddCode') + '" xandrsegmentRemove="' + x.getAttribute('xandrsegmentRemove') + '" xandrsegmentRemoveCode="' + x.getAttribute('xandrsegmentRemoveCode') + '" xandrsegmentMember="' + x.getAttribute('xandrsegmentMember') + '" xandrsegmentRedir="' + x.getAttribute('xandrsegmentRedir') + '" xandrsegmentValue="' + x.getAttribute('xandrsegmentValue') + '" xandrsegmentOther="' + x.getAttribute('xandrsegmentOther') + '"></div>';
        });

        for (i = 0; i < uniqIds.length; i += 1) {
            uri = '//ib.adnxs.com/seg?t=2&';
            uri += 'add=' + document.getElementById(uniqIds[i]).getAttribute('xandrsegmentAdd') + '&';
            uri += 'add_code=' + document.getElementById(uniqIds[i]).getAttribute('xandrsegmentAddCode') + '&';
            uri += 'remove=' + document.getElementById(uniqIds[i]).getAttribute('xandrsegmentRemove') + '&';
            uri += 'remove_code=' + document.getElementById(uniqIds[i]).getAttribute('xandrsegmentRemoveCode') + '&';
            uri += 'member=' + document.getElementById(uniqIds[i]).getAttribute('xandrsegmentMember') + '&';
            uri += 'redir=' + document.getElementById(uniqIds[i]).getAttribute('xandrsegmentRedir') + '&';
            uri += 'value=' + document.getElementById(uniqIds[i]).getAttribute('xandrsegmentValue') + '&';
            uri += 'other=' + document.getElementById(uniqIds[i]).getAttribute('xandrsegmentOther');

            document.getElementById(uniqIds[i]).innerHTML = '<img src=\'' + uri + '\' width=\'1\' height=\'1\' />';
        }
    },
    "fallback": function () {
        let id = 'xandrsegment';
        TarteAuCitron.fallback(['xandrsegment-canvas'], TarteAuCitron.engage(id));
    }
};

// xandr conversion
// https://docs.xandr.com/bundle/invest_invest-standard/page/topics/working-with-conversion-pixels.html
export let xandrconversion = {
    "key": "xandrconversion",
    "type": "ads",
    "name": "Xandr (Conversion)",
    "uri": "https://www.xandr.com/privacy/cookie-policy/",
    "needConsent": true,
    "options": {},
    "cookies": ['uuid2', 'uids', 'sess', 'icu', 'anj', 'usersync'],
    "js": function () {
        let uniqIds = [],
            i,
            uri;

        TarteAuCitron.fallback(['xandrconversion-canvas'], function (x) {
            let uniqId = '_' + Math.random().toString(36).substr(2, 9);
            uniqIds.push(uniqId);
            return '<div id="' + uniqId + '" xandrconversionId="' + x.getAttribute('xandrconversionId') + '" xandrconversionSeg="' + x.getAttribute('xandrconversionSeg') + '" xandrconversionOrderId="' + x.getAttribute('xandrconversionOrderId') + '" xandrconversionValue="' + x.getAttribute('xandrconversionValue') + '" xandrconversionRedir="' + x.getAttribute('xandrconversionRedir') + '" xandrconversionOther="' + x.getAttribute('xandrconversionOther') + '"></div>';
        });

        for (i = 0; i < uniqIds.length; i += 1) {
            uri = '//ib.adnxs.com/px?t=2&';
            uri += 'id=' + document.getElementById(uniqIds[i]).getAttribute('xandrconversionId') + '&';
            uri += 'seg=' + document.getElementById(uniqIds[i]).getAttribute('xandrconversionSeg') + '&';
            uri += 'order_id=' + document.getElementById(uniqIds[i]).getAttribute('xandrconversionOrderId') + '&';
            uri += 'value=' + document.getElementById(uniqIds[i]).getAttribute('xandrconversionValue') + '&';
            uri += 'redir=' + document.getElementById(uniqIds[i]).getAttribute('xandrconversionRedir') + '&';
            uri += 'other=' + document.getElementById(uniqIds[i]).getAttribute('xandrconversionOther');

            document.getElementById(uniqIds[i]).innerHTML = '<img src=\'' + uri + '\' width=\'1\' height=\'1\' />';
        }
    },
    "fallback": function () {
        let id = 'xandrconversion';
        TarteAuCitron.fallback(['xandrconversion-canvas'], TarteAuCitron.engage(id));
    }
};

// helloasso
export let helloasso = {
    "key": "helloasso",
    "type": "api",
    "name": "HelloAsso",
    "uri": "https://www.helloasso.com/confidentialite",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        TarteAuCitron.fallback(['tac_helloasso'], function (x) {
            let frame_title = TarteAuCitron.fixSelfXSS(x.getAttribute("title") || 'HelloAsso iframe'),
                width = x.getAttribute("width"),
                height = x.getAttribute("height"),
                url = x.getAttribute("data-url"),
                allowfullscreen = x.getAttribute("allowfullscreen");

            return '<iframe title="' + frame_title + '" id="haWidget" src="' + url + '" width="' + width + '" height="' + height + '" scrolling="auto" allowtransparency ' + (allowfullscreen === '0' ? '' : ' webkitallowfullscreen mozallowfullscreen allowfullscreen') + '></iframe>';
        });
    },
    "fallback": function () {
        let id = 'helloasso';
        TarteAuCitron.fallback(['tac_helloasso'], function (elem) {
            elem.style.width = elem.getAttribute('width') + 'px';
            elem.style.height = elem.getAttribute('height') + 'px';
            return TarteAuCitron.engage(id);
        });
    }
};

// podcloud
export let podcloud = {
    "key": "podcloud",
    "type": "video",
    "name": "podCloud",
    "uri": "https://podcloud.fr/privacy",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        TarteAuCitron.fallback(['tac_podcloud'], function (x) {
            let frame_title = TarteAuCitron.fixSelfXSS(x.getAttribute("title") || 'podCloud iframe'),
                width = x.getAttribute("width"),
                height = x.getAttribute("height"),
                url = x.getAttribute("data-url"),
                allowfullscreen = x.getAttribute("allowfullscreen");

            return '<iframe title="' + frame_title + '" src="' + url + '" width="' + width + '" height="' + height + '" scrolling="auto" allowtransparency ' + (allowfullscreen === '0' ? '' : ' webkitallowfullscreen mozallowfullscreen allowfullscreen') + '></iframe>';
        });
    },
    "fallback": function () {
        let id = 'podcloud';
        TarteAuCitron.fallback(['tac_podcloud'], function (elem) {
            elem.style.width = elem.getAttribute('width') + 'px';
            elem.style.height = elem.getAttribute('height') + 'px';
            return TarteAuCitron.engage(id);
        });
    }
};

// facebookpost
export let facebookpost = {
    "key": "facebookpost",
    "type": "social",
    "name": "Facebook (post)",
    "uri": "https://www.facebook.com/policy.php",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        TarteAuCitron.fallback(['tac_facebookpost'], function (x) {
            let frame_title = TarteAuCitron.fixSelfXSS(x.getAttribute("title") || 'Facebook iframe'),
                width = x.getAttribute("width"),
                height = x.getAttribute("height"),
                url = x.getAttribute("data-url"),
                appId = x.getAttribute("data-appid"),
                allowfullscreen = x.getAttribute("allowfullscreen");

            return '<iframe title="' + frame_title + '" src="https://www.facebook.com/plugins/post.php?href=' + encodeURIComponent(url) + '&amp;width=' + width + '&amp;show_text=false&amp;appId=' + appId + '&amp;height=' + height + '" width="' + width + '" height="' + height + '" scrolling="auto" allowtransparency ' + (allowfullscreen === '0' ? '' : ' webkitallowfullscreen mozallowfullscreen allowfullscreen') + '></iframe>';
        });
    },
    "fallback": function () {
        let id = 'facebookpost';
        TarteAuCitron.fallback(['tac_facebookpost'], function (elem) {
            elem.style.width = elem.getAttribute('width') + 'px';
            elem.style.height = elem.getAttribute('height') + 'px';
            return TarteAuCitron.engage(id);
        });
    }
};

// amplitude
export let amplitude = {
    "key": "amplitude",
    "type": "analytic",
    "name": "Amplitude",
    "uri": "https://amplitude.com/privacy",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        if (this.options.amplitude === undefined) {
            return;
        }
        TarteAuCitron.addScript('https://cdn.amplitude.com/libs/amplitude-5.8.0-min.gz.js', '', function () {

            window.amplitude = {
                _q: [],
                _iq: {}
            };
            function s(e, t) { e.prototype[t] = function () { this._q.push([t].concat(Array.prototype.slice.call(arguments, 0))); return this } }
            let o = function () { this._q = []; return this };
            let a = ["add", "append", "clearAll", "prepend", "set", "setOnce", "unset"];
            for (let u = 0; u < a.length; u++) { s(o, a[u]) }
            amplitude.Identify = o;
            let c = function () { this._q = []; return this };
            let l = ["setProductId", "setQuantity", "setPrice", "setRevenueType", "setEventProperties"];
            for (let p = 0; p < l.length; p++) { s(c, l[p]) }
            amplitude.Revenue = c;
            let d = ["init", "logEvent", "logRevenue", "setUserId", "setUserProperties", "setOptOut", "setVersionName", "setDomain", "setDeviceId", "enableTracking", "setGlobalUserProperties", "identify", "clearUserProperties", "setGroup", "logRevenueV2", "regenerateDeviceId", "groupIdentify", "onInit", "logEventWithTimestamp", "logEventWithGroups", "setSessionId", "resetSessionId"];
            function v(e) { function t(t) { e[t] = function () { e._q.push([t].concat(Array.prototype.slice.call(arguments, 0))) } } for (let n = 0; n < d.length; n++) { t(d[n]) } }
            v(amplitude);
            amplitude.getInstance = function (e) { e = (!e || e.length === 0 ? "$default_instance" : e).toLowerCase(); if (!amplitude._iq.hasOwnProperty(e)) { amplitude._iq[e] = { _q: [] }; v(amplitude._iq[e]) } return amplitude._iq[e] };

            amplitude.getInstance().init(this.options.amplitude);
        });
    }
};

// abtasty
export let abtasty = {
    "key": "abtasty",
    "type": "api",
    "name": "ABTasty",
    "uri": "https://www.abtasty.com/terms-of-use/",
    "needConsent": true,
    "options": {},
    "cookies": ['ABTasty', 'ABTastySession'],
    "js": function () {
        if (this.options.abtastyID === undefined) {
            return;
        }
        TarteAuCitron.addScript('//try.abtasty.com/' + this.options.abtastyID + '.js');
    }
};


// yandex metrica
export let metrica = {
    "key": "metrica",
    "type": "analytic",
    "name": "Yandex Metrica",
    "uri": "https://yandex.com/legal/confidential/",
    "needConsent": true,
    "options": {},
    "cookies": ['_ym_metrika_enabled', '_ym_isad', '_ym_uid', '_ym_d', 'yabs-sid', '_ym_debug', '_ym_mp2_substs', '_ym_hostIndex', '_ym_mp2_track', 'yandexuid', 'usst'],
    "js": function () {
        if (this.options.yandexmetrica === undefined) {
            return;
        }
        TarteAuCitron.addScript('https://mc.yandex.ru/metrika/tag.js', '', function () {

            (function (m, e, t, r, i, k, a) {
                m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments) };
                m[i].l = 1 * new Date(); k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a)
            })
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

            ym(this.options.yandexmetrica, "init", {
                clickmap: true,
                trackLinks: true,
                accurateTrackBounce: true,
                webvisor: true,
                ecommerce: "dataLayer"
            });
        });
    }
};

// addthis
export let addthis = {
    "key": "addthis",
    "type": "social",
    "name": "AddThis",
    "uri": "https://www.addthis.com/privacy/privacy-policy#publisher-visitors",
    "needConsent": true,
    "options": {},
    "cookies": ['__atuvc', '__atuvs'],
    "js": function () {
        if (this.options.addthisPubId === undefined) {
            return;
        }
        if (TarteAuCitron.isAjax === true) {
            window.addthis = null;
            window._adr = null;
            window._atc = null;
            window._atd = null;
            window._ate = null;
            window._atr = null;
            window._atw = null;
        }
        TarteAuCitron.fallback(['addthis_inline_share_toolbox'], '');
        TarteAuCitron.addScript('//s7.addthis.com/js/300/addthis_widget.js#pubid=' + this.options.addthisPubId);
    },
    "fallback": function () {
        let id = 'addthis';
        TarteAuCitron.fallback(['addthis_inline_share_toolbox'], TarteAuCitron.engage(id));
    }
};

// addtoanyfeed
export let addtoanyfeed = {
    "key": "addtoanyfeed",
    "type": "social",
    "name": "AddToAny (feed)",
    "uri": "https://www.addtoany.com/privacy",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        if (this.options.addtoanyfeedUri === undefined) {
            return;
        }
        this.options.addtoanyfeedSubscribeLink = 'https://www.addtoany.com/subscribe?linkurl=' + this.options.addtoanyfeedUri;
        window.a2a_config = window.a2a_config || {};
        window.a2a_config.linkurl = this.options.addtoanyfeedUri;
        TarteAuCitron.addScript('//static.addtoany.com/menu/feed.js');
    },
    "fallback": function () {
        this.options.addtoanyfeedSubscribeLink = 'https://www.addtoany.com/subscribe?linkurl=' + this.options.addtoanyfeedUri;
    }
};

// addtoanyshare
export let addtoanyshare = {
    "key": "addtoanyshare",
    "type": "social",
    "name": "AddToAny (share)",
    "uri": "https://www.addtoany.com/privacy",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        TarteAuCitron.fallback(['tac_addtoanyshare'], function (elem) {
            elem.remove();
        }, true);
        TarteAuCitron.addScript('//static.addtoany.com/menu/page.js');
    },
    "fallback": function () {
        let id = 'addtoanyshare';
        TarteAuCitron.fallback(['tac_addtoanyshare'], TarteAuCitron.engage(id));
    }
};

// aduptech ads
export let aduptech_ads = {
    "key": "aduptech_ads",
    "type": "ads",
    "name": "Ad Up Technology (ads)",
    "uri": "https://www.adup-tech.com/datenschutz",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {

        let IDENTIFIER = "aduptech_ads",
            API_URL = "https://s.d.adup-tech.com/jsapi";

        let elements = document.getElementsByClassName(IDENTIFIER);
        if (!elements || elements.length === 0) {
            return;
        }

        TarteAuCitron.fallback([IDENTIFIER], "");

        TarteAuCitron.addScript(API_URL, "", function () {
            for (let i = 0; i < elements.length; i++) {
                let element = elements[i];

                if (!element.getAttribute("id")) {
                    element.setAttribute("id", IDENTIFIER + Math.random().toString(36).substr(2, 9));
                }

                window.uAd.embed(element.getAttribute("id"), {
                    placementKey: element.getAttribute("placementKey"),
                    responsive: Boolean(element.getAttribute("responsive")),
                    lazy: Boolean(element.getAttribute("lazy")),
                    adtest: Boolean(element.getAttribute("test")),
                    query: element.getAttribute("query") || "",
                    minCpc: element.getAttribute("minCpc") || "",
                    pageUrl: element.getAttribute("pageUrl") || "",
                    skip: element.getAttribute("skip") || ""
                });
            }
        });

    },
    "fallback": function () {
        TarteAuCitron.fallback(["aduptech_ads"], TarteAuCitron.engage("aduptech_ads"));
    }
};

// aduptech conversion
export let aduptech_conversion = {
    "key": "aduptech_conversion",
    "type": "ads",
    "name": "Ad Up Technology (conversion)",
    "uri": "https://www.adup-tech.com/datenschutz",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {

        let IDENTIFIER = "aduptech_conversion",
            CONVERSION_PIXEL_BASE_URL = "https://d.adup-tech.com/campaign/conversion";

        let elements = document.getElementsByClassName(IDENTIFIER);
        if (!elements || elements.length === 0) {
            return;
        }

        TarteAuCitron.fallback([IDENTIFIER], "");

        for (let i = 0; i < elements.length; i++) {
            let element = elements[i];

            if (!element.getAttribute("advertiserId") || !element.getAttribute("conversionCode")) {
                continue;
            }

            let url = CONVERSION_PIXEL_BASE_URL +
                "/" + encodeURIComponent(element.getAttribute("advertiserId")) +
                "?t=" + encodeURIComponent(element.getAttribute("conversionCode"));

            if (element.getAttribute("price")) {
                url += "&price=" + encodeURIComponent(element.getAttribute("price"));
            }

            if (element.getAttribute("quantity")) {
                url += "&quantity=" + encodeURIComponent(element.getAttribute("quantity"));
            }

            if (element.getAttribute("total")) {
                url += "&total=" + encodeURIComponent(element.getAttribute("total"));
            }

            if (element.getAttribute("orderId")) {
                url += "&order_id=" + encodeURIComponent(element.getAttribute("orderId"));
            }

            if (element.getAttribute("itemNumber")) {
                url += "&item_number=" + encodeURIComponent(element.getAttribute("itemNumber"));
            }

            if (element.getAttribute("description")) {
                url += "&description=" + encodeURIComponent(element.getAttribute("description"));
            }

            (new Image()).src = url;
        }
    }
};

// aduptech retargeting
export let aduptech_retargeting = {
    "key": "aduptech_retargeting",
    "type": "ads",
    "name": "Ad Up Technology (retargeting)",
    "uri": "https://www.adup-tech.com/datenschutz",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {

        let IDENTIFIER = "aduptech_retargeting",
            API_URL = "https://s.d.adup-tech.com/services/retargeting.js";

        let elements = document.getElementsByClassName(IDENTIFIER);
        if (!elements || elements.length === 0) {
            return;
        }

        TarteAuCitron.fallback([IDENTIFIER], "");

        window.AdUpRetargeting = function (api) {
            for (let i = 0; i < elements.length; i++) {
                let element = elements[i];

                api.init();

                api.setAccount(element.getAttribute("account"));

                if (element.getAttribute("email")) {
                    api.setEmail(element.getAttribute("email"));
                } else if (element.getAttribute("hashedEmail")) {
                    api.setHashedEmail(element.getAttribute("hashedEmail"));
                }

                if (element.getAttribute("product")) {
                    try {
                        api.setProduct(JSON.parse(element.getAttribute("product")));
                    } catch (e) {
                        api.setProduct(element.getAttribute("product"));
                    }
                }

                if (element.getAttribute("transaction")) {
                    try {
                        api.setTransaction(JSON.parse(element.getAttribute("transaction")));
                    } catch (e) {
                        api.setTransaction(element.getAttribute("transaction"));
                    }
                }

                if (element.getAttribute("demarkUser")) {
                    api.setDemarkUser();
                } else if (element.getAttribute("demarkProducts")) {
                    api.setDemarkProducts();
                }

                if (element.getAttribute("conversionCode")) {
                    api.setConversionCode(element.getAttribute("conversionCode"));
                }

                if (element.getAttribute("device")) {
                    let setter = "set" + element.getAttribute("device").charAt(0).toUpperCase() + element.getAttribute("device").slice(1);
                    if (typeof api[setter] === 'function') {
                        api[setter]();
                    }
                }

                if (element.getAttribute("track")) {
                    let tracker = "track" + element.getAttribute("track").charAt(0).toUpperCase() + element.getAttribute("track").slice(1);
                    if (typeof api[tracker] === "function") {
                        api[tracker]();
                    } else {
                        api.trackHomepage();
                    }
                }
            };
        };

        TarteAuCitron.addScript(API_URL);
    }
};

// alexa
export let alexa = {
    "key": "alexa",
    "type": "analytic",
    "name": "Alexa",
    "uri": "https://www.alexa.com/help/privacy",
    "needConsent": true,
    "options": {},
    "cookies": ['__asc', '__auc'],
    "js": function () {
        if (this.options.alexaAccountID === undefined) {
            return;
        }
        window._atrk_opts = {
            atrk_acct: this.options.alexaAccountID,
            domain: window.location.hostname.match(/[^\.]*\.[^.]*$/)[0],
            dynamic: true
        };
        TarteAuCitron.addScript('https://d31qbv1cthcecs.cloudfront.net/atrk.js');
    }
};

// amazon
export let amazon = {
    "key": "amazon",
    "type": "ads",
    "name": "Amazon",
    "uri": "https://www.amazon.com/gp/help/customer/display.html/ref=help_search_1-1?ie=UTF8&nodeId=201909010&qid=1544617177&sr=1-1",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        TarteAuCitron.fallback(['amazon_product'], function (x) {
            let frame_title = TarteAuCitron.fixSelfXSS(x.getAttribute("title") || 'Amazon iframe'),
                amazonId = x.getAttribute("amazonid"),
                productId = x.getAttribute("productid"),
                url = '//ws-eu.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=' + TarteAuCitron.getLanguage().toUpperCase() + '&source=ss&ref=ss_til&ad_type=product_link&tracking_id=' + amazonId + '&marketplace=amazon&region=' + TarteAuCitron.getLanguage().toUpperCase() + '&placement=' + productId + '&asins=' + productId + '&show_border=true&link_opens_in_new_window=true',
                iframe = '<iframe title="' + frame_title + '" style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" src="' + url + '"></iframe>';

            return iframe;
        });
    },
    "fallback": function () {
        let id = 'amazon';
        TarteAuCitron.fallback(['amazon_product'], TarteAuCitron.engage(id));
    }
};

// calameo
export let calameo = {
    "key": "calameo",
    "type": "video",
    "name": "Calameo",
    "uri": "https://fr.calameo.com/privacy",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        TarteAuCitron.fallback(['calameo-canvas'], function (x) {
            let frame_title = TarteAuCitron.fixSelfXSS(x.getAttribute("title") || 'Calameo iframe'),
                id = x.getAttribute("data-id"),
                width = x.getAttribute("width"),
                height = x.getAttribute("height"),
                url = '//v.calameo.com/?bkcode=' + id,
                allowfullscreen = x.getAttribute("allowfullscreen");

            return '<iframe title="' + frame_title + '" src="' + url + '" width="' + width + '" height="' + height + '" scrolling="no" allowtransparency ' + (allowfullscreen === '0' ? '' : ' webkitallowfullscreen mozallowfullscreen allowfullscreen') + '></iframe>';
        });
    },
    "fallback": function () {
        let id = 'calameo';
        TarteAuCitron.fallback(['calameo-canvas'], function (elem) {
            elem.style.width = elem.getAttribute('width') + 'px';
            elem.style.height = elem.getAttribute('height') + 'px';
            return TarteAuCitron.engage(id);
        });
    }
};

// clicky
export let clicky = {
    "key": "clicky",
    "type": "analytic",
    "name": "Clicky",
    "uri": "https://clicky.com/terms",
    "needConsent": true,
    "options": {},
    "cookies":[], // ['_jsuid', '_eventqueue', '_referrer_og', '_utm_og', '_first_pageview', 'clicky_olark', 'no_trackyy_' + this.options.clickyId, 'unpoco_' + this.options.clickyId, 'heatmaps_g2g_' + this.options.clickyId],
    "js": function () {
        if (this.options.clickyId === undefined) {
            return;
        }
        TarteAuCitron.addScript('//static.getclicky.com/js', '', function () {
            if (typeof clicky.init === 'function') {
                clicky.init(this.options.clickyId);
            }
            if (typeof this.options.clickyMore === 'function') {
                this.options.clickyMore();
            }
        });
    }
};

// clicmanager
export let clicmanager = {
    "key": "clicmanager",
    "type": "ads",
    "name": "Clicmanager",
    "uri": "http://www.clicmanager.fr/infos_legales.php",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        let uniqIds = [],
            i,
            uri;

        TarteAuCitron.fallback(['clicmanager-canvas'], function (x) {
            let uniqId = '_' + Math.random().toString(36).substr(2, 9);
            uniqIds.push(uniqId);
            return '<div id="' + uniqId + '" c="' + x.getAttribute('c') + '" s="' + x.getAttribute('s') + '" t="' + x.getAttribute('t') + '"></div>';
        });

        for (i = 0; i < uniqIds.length; i += 1) {
            uri = '//ads.clicmanager.fr/exe.php?';
            uri += 'c=' + document.getElementById(uniqIds[i]).getAttribute('c') + '&';
            uri += 's=' + document.getElementById(uniqIds[i]).getAttribute('s') + '&';
            uri += 't=' + document.getElementById(uniqIds[i]).getAttribute('t');

            TarteAuCitron.makeAsync.init(uri, uniqIds[i]);
        }
    },
    "fallback": function () {
        let id = 'clicmanager';
        TarteAuCitron.fallback(['clicmanager-canvas'], TarteAuCitron.engage(id));
    }
};

// compteur
export let compteur = {
    "key": "compteur",
    "type": "analytic",
    "name": "Compteur.fr",
    "uri": "https://www.compteur.fr/help_privacy_policy.htm",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        if (this.options.compteurID === undefined) {
            return;
        }
        TarteAuCitron.addScript('https://server2.compteur.fr/log7.js', '', function () { wtslog7(this.options.compteurID, 1); });
    }
};

// contentsquare
export let contentsquare = {
    "key": "contentsquare",
    "type": "api",
    "name": "ContentSquare",
    "uri": "https://docs.contentsquare.com/uxa-en/#collected-data",
    "needConsent": true,
    "options": {contentsquareID: null},
    "cookies": ['_cs_id', '_cs_s', '_cs_vars', '_cs_ex', '_cs_c', '_cs_optout'],
    "js": function () {
        if (this.options.contentsquareID === undefined) {
            return;
        }

        TarteAuCitron.addScript('//t.contentsquare.net/uxa/' + this.options.contentsquareID + '.js');
    }
};

// crazyegg
export let crazyegg = {
    "key": "crazyegg",
    "type": "analytic",
    "name": "Crazy Egg",
    "uri": "https://www.crazyegg.com/privacy",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {

        if (this.options.crazyeggId === undefined) {
            return;
        }

        TarteAuCitron.addScript('//script.crazyegg.com/pages/scripts/' + this.options.crazyeggId.substr(0, 4) + '/' + this.options.crazyeggId.substr(4, 4) + '.js');
    }
};

// clarity
export let clarity = {
    "key": "clarity",
    "type": "analytic",
    "name": "Clarity",
    "uri": "https://clarity.microsoft.com/",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {

        window["clarity"] = window["clarity"] || function () { (window["clarity"].q = window["clarity"].q || []).push(arguments) };

        TarteAuCitron.addScript('https://www.clarity.ms/tag/' + this.options.clarity);
    }
};

// criteo
export let criteo = {
    "key": "criteo",
    "type": "ads",
    "name": "Criteo",
    "uri": "http://www.criteo.com/privacy/",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        document.MAX_ct0 = '';
        let uniqIds = [],
            i,
            uri;

        TarteAuCitron.fallback(['criteo-canvas'], function (x) {
            let uniqId = '_' + Math.random().toString(36).substr(2, 9);
            uniqIds.push(uniqId);
            return '<div id="' + uniqId + '" zoneid="' + x.getAttribute('zoneid') + '"></div>';
        });

        for (i = 0; i < uniqIds.length; i += 1) {
            uri = '//cas.criteo.com/delivery/ajs.php?';
            uri += 'zoneid=' + document.getElementById(uniqIds[i]).getAttribute('zoneid');
            uri += '&nodis=1&cb=' + Math.floor(Math.random() * 99999999999);
            uri += '&loc=' + encodeURI(window.location);
            uri += (document.MAX_used !== ',') ? '&exclude=' + document.MAX_used : '';
            uri += (document.charset !== undefined ? '&charset=' + document.charset : '');
            uri += (document.characterSet !== undefined ? '&charset=' + document.characterSet : '');
            uri += (document.referrer !== undefined) ? '&referer=' + encodeURI(document.referrer) : '';
            uri += (document.context !== undefined) ? '&context=' + encodeURI(document.context) : '';
            uri += ((document.MAX_ct0 !== undefined) && (document.MAX_ct0.substring(0, 4) === 'http')) ? '&ct0=' + encodeURI(document.MAX_ct0) : '';
            uri += (document.mmm_fo !== undefined) ? '&mmm_fo=1' : '';

            TarteAuCitron.makeAsync.init(uri, uniqIds[i]);
        }
    },
    "fallback": function () {
        let id = 'criteo';
        TarteAuCitron.fallback(['criteo-canvas'], TarteAuCitron.engage(id));
    }
};

// artetv
export let artetv = {
    "key": "artetv",
    "type": "video",
    "name": "Arte.tv",
    "uri": "https://www.arte.tv/sites/fr/corporate/donnees-personnelles/",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        TarteAuCitron.fallback(['artetv_player'], function (x) {
            let frame_title = TarteAuCitron.fixSelfXSS(x.getAttribute("title") || 'Arte.tv iframe'),
                video_json = x.getAttribute("json"),
                video_width = x.getAttribute("width"),
                video_height = x.getAttribute("height"),
                video_frame,
                video_allowfullscreen = x.getAttribute("allowfullscreen");

            if (video_json === undefined) {
                return "";
            }

            video_frame = '<iframe title="' + frame_title + '" style="transition-duration: 0; transition-property: no; margin: 0 auto; position: relative; display: block; background-color: #000000;" src="https://www.arte.tv/player/v5/index.php?json_url=' + video_json + '" width="' + video_width + '" height="' + video_height + '" scrolling="no" ' + (video_allowfullscreen === '0' ? '' : ' webkitallowfullscreen mozallowfullscreen allowfullscreen') + '></iframe>';
            return video_frame;
        });
    },
    "fallback": function () {
        let id = 'artetv';
        TarteAuCitron.fallback(['artetv_player'], function (elem) {
            elem.style.width = elem.getAttribute('width') + 'px';
            elem.style.height = elem.getAttribute('height') + 'px';
            return TarteAuCitron.engage(id);
        });
    }
};

// dailymotion
export let dailymotion = {
    "key": "dailymotion",
    "type": "video",
    "name": "Dailymotion",
    "uri": "https://www.dailymotion.com/legal/privacy",
    "needConsent": true,
    "options": {},
    "cookies": ['ts', 'dmvk', 'hist', 'v1st', 's_vi'],
    "js": function () {
        TarteAuCitron.fallback(['dailymotion_player'], function (x) {
            let frame_title = TarteAuCitron.fixSelfXSS(TarteAuCitron.getElemAttr(x, "title") || 'Dailymotion iframe'),
                video_id = TarteAuCitron.getElemAttr(x, "videoID"),
                video_width = TarteAuCitron.getElemAttr(x, "width"),
                frame_width = 'width=',
                video_height = TarteAuCitron.getElemAttr(x, "height"),
                frame_height = 'height=',
                video_frame,
                embed_type = TarteAuCitron.getElemAttr(x, "embedType"),
                allowfullscreen = TarteAuCitron.getElemAttr(x, "allowfullscreen"),
                params = 'info=' + TarteAuCitron.getElemAttr(x, "showinfo") + '&autoPlay=' + TarteAuCitron.getElemAttr(x, "autoplay");

            if (video_id === undefined) {
                return "";
            }
            if (video_width !== undefined) {
                frame_width += '"' + video_width + '" ';
            } else {
                frame_width += '"" ';
            }
            if (video_height !== undefined) {
                frame_height += '"' + video_height + '" ';
            } else {
                frame_height += '"" ';
            }
            if (embed_type === undefined || !['video', 'playlist'].includes(embed_type)) {
                embed_type = "video";
            }
            video_frame = '<iframe title="' + frame_title + '" src="//www.dailymotion.com/embed/' + embed_type + '/' + video_id + '?' + params + '" ' + frame_width + frame_height + (allowfullscreen === '0' ? '' : ' webkitallowfullscreen mozallowfullscreen allowfullscreen') + '></iframe>';
            return video_frame;
        });
    },
    "fallback": function () {
        let id = 'dailymotion';
        TarteAuCitron.fallback(['dailymotion_player'], function (elem) {
            elem.style.width = elem.getAttribute('width') + 'px';
            elem.style.height = elem.getAttribute('height') + 'px';
            return TarteAuCitron.engage(id);
        });
    }
};

// dating affiliation
export let datingaffiliation = {
    "key": "datingaffiliation",
    "type": "ads",
    "name": "Dating Affiliation",
    "uri": "http://www.dating-affiliation.com/conditions-generales.php",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        TarteAuCitron.fallback(['datingaffiliation-canvas'], function (x) {
            let frame_title = TarteAuCitron.fixSelfXSS(x.getAttribute("title") || 'Dating Affiliation iframe'),
                comfrom = x.getAttribute("data-comfrom"),
                r = x.getAttribute("data-r"),
                p = x.getAttribute("data-p"),
                cf0 = x.getAttribute("data-cf0"),
                langue = x.getAttribute("data-langue"),
                forward_affiliate = x.getAttribute("data-forwardAffiliate"),
                cf2 = x.getAttribute("data-cf2"),
                cfsa2 = x.getAttribute("data-cfsa2"),
                width = x.getAttribute("width"),
                height = x.getAttribute("height"),
                url = 'http://www.tools-affil2.com/rotaban/ban.php?' + comfrom;

            return '<iframe title="' + frame_title + '" src="' + url + '&r=' + r + '&p=' + p + '&cf0=' + cf0 + '&langue=' + langue + '&forward_affiliate=' + forward_affiliate + '&cf2=' + cf2 + '&cfsa2=' + cfsa2 + '" width="' + width + '" height="' + height + '" marginheight="0" marginwidth="0" scrolling="no"></iframe>';
        });
    },
    "fallback": function () {
        let id = 'datingaffiliation';
        TarteAuCitron.fallback(['datingaffiliation-canvas'], function (elem) {
            elem.style.width = elem.getAttribute('width') + 'px';
            elem.style.height = elem.getAttribute('height') + 'px';
            return TarteAuCitron.engage(id);
        });
    }
};

// dating affiliation popup
export let datingaffiliationpopup = {
    "key": "datingaffiliationpopup",
    "type": "ads",
    "name": "Dating Affiliation (Pop Up)",
    "uri": "http://www.dating-affiliation.com/conditions-generales.php",
    "needConsent": true,
    "options": {},
    "cookies": ['__utma', '__utmb', '__utmc', '__utmt_Tools', '__utmv', '__utmz', '_ga', '_gat', '_gat_UA-65072040-17', '__da-pu-xflirt-ID-pc-o169'],
    "js": function () {
        let uniqIds = [],
            i,
            uri;

        TarteAuCitron.fallback(['datingaffiliationpopup-canvas'], function (x) {
            let uniqId = '_' + Math.random().toString(36).substr(2, 9);
            uniqIds.push(uniqId);
            return '<div id="' + uniqId + '" uri="' + x.getAttribute('uri') + '" comfrom="' + x.getAttribute('comfrom') + '" promo="' + x.getAttribute('promo') + '" productid="' + x.getAttribute('productid') + '" submitconfig="' + x.getAttribute('submitconfig') + '" ur="' + x.getAttribute('ur') + '" brand="' + x.getAttribute('brand') + '" lang="' + x.getAttribute('lang') + '" cf0="' + x.getAttribute('cf0') + '" cf2="' + x.getAttribute('cf2') + '" subid1="' + x.getAttribute('subid1') + '" cfsa2="' + x.getAttribute('cfsa2') + '" subid2="' + x.getAttribute('subid2') + '" nicheid="' + x.getAttribute('nicheid') + '" degreid="' + x.getAttribute('degreid') + '" bt="' + x.getAttribute('bt') + '" vis="' + x.getAttribute('vis') + '" hid="' + x.getAttribute('hid') + '" snd="' + x.getAttribute('snd') + '" aabd="' + x.getAttribute('aabd') + '" aabs="' + x.getAttribute('aabs') + '"></div>';
        });

        for (i = 0; i < uniqIds.length; i += 1) {
            uri = 'http://www.promotools.biz/da/popunder/script.php?';
            uri += 'comfrom=' + document.getElementById(uniqIds[i]).getAttribute('comfrom') + '&';
            uri += 'promo=' + document.getElementById(uniqIds[i]).getAttribute('promo') + '&';
            uri += 'product_id=' + document.getElementById(uniqIds[i]).getAttribute('productid') + '&';
            uri += 'submitconfig=' + document.getElementById(uniqIds[i]).getAttribute('submitconfig') + '&';
            uri += 'ur=' + document.getElementById(uniqIds[i]).getAttribute('ur') + '&';
            uri += 'brand=' + document.getElementById(uniqIds[i]).getAttribute('brand') + '&';
            uri += 'lang=' + document.getElementById(uniqIds[i]).getAttribute('lang') + '&';
            uri += 'cf0=' + document.getElementById(uniqIds[i]).getAttribute('cf0') + '&';
            uri += 'cf2=' + document.getElementById(uniqIds[i]).getAttribute('cf2') + '&';
            uri += 'subid1=' + document.getElementById(uniqIds[i]).getAttribute('subid1') + '&';
            uri += 'cfsa2=' + document.getElementById(uniqIds[i]).getAttribute('cfsa2') + '&';
            uri += 'subid2=' + document.getElementById(uniqIds[i]).getAttribute('subid2') + '&';
            uri += 'nicheId=' + document.getElementById(uniqIds[i]).getAttribute('nicheid') + '&';
            uri += 'degreId=' + document.getElementById(uniqIds[i]).getAttribute('degreid') + '&';
            uri += 'bt=' + document.getElementById(uniqIds[i]).getAttribute('bt') + '&';
            uri += 'vis=' + document.getElementById(uniqIds[i]).getAttribute('vis') + '&';
            uri += 'hid=' + document.getElementById(uniqIds[i]).getAttribute('hid') + '&';
            uri += 'snd=' + document.getElementById(uniqIds[i]).getAttribute('snd') + '&';
            uri += 'aabd=' + document.getElementById(uniqIds[i]).getAttribute('aabd') + '&';
            uri += 'aabs=' + document.getElementById(uniqIds[i]).getAttribute('aabs');

            TarteAuCitron.makeAsync.init(uri, uniqIds[i]);
        }
    },
    "fallback": function () {
        let id = 'datingaffiliationpopup';
        TarteAuCitron.fallback(['datingaffiliationpopup-canvas'], TarteAuCitron.engage(id));
    }
};

// deezer
export let deezer = {
    "key": "deezer",
    "type": "video",
    "name": "Deezer",
    "uri": "https://www.deezer.com/legal/personal-datas",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        TarteAuCitron.fallback(['deezer_player'], function (x) {
            let frame_title = TarteAuCitron.fixSelfXSS(x.getAttribute("title") || 'Deezer iframe'),
                deezer_id = x.getAttribute("deezerID"),
                deezer_width = x.getAttribute("width"),
                frame_width = 'width=',
                deezer_height = x.getAttribute("height"),
                frame_height = 'height=',
                deezer_frame,
                embed_theme = x.getAttribute("theme"),
                embed_type = x.getAttribute("embedType"),
                radius = x.getAttribute("radius"),
                tracklist = x.getAttribute("tracklist"),
                allowfullscreen = x.getAttribute("allowfullscreen"),
                params;

            if (deezer_id === undefined) {
                return "";
            }
            if (deezer_width !== undefined) {
                frame_width += '"' + deezer_width + '" ';
            } else {
                frame_width += '"" ';
            }
            if (deezer_height !== undefined) {
                frame_height += '"' + deezer_height + '" ';
            } else {
                frame_height += '"" ';
            }
            if (embed_theme === undefined || !['auto', 'light', 'dark'].includes(embed_theme)) {
                embed_theme = "auto";
            }
            if (embed_type === undefined || !['album', 'track', 'playlist'].includes(embed_type)) {
                embed_type = "album";
            }
            if (radius === undefined || !['true', 'false'].includes(radius)) {
                radius = "true";
            }
            if (tracklist === undefined || !['true', 'false'].includes(tracklist)) {
                tracklist = "true";
            }
            params = 'tracklist=' + tracklist + '&radius=' + radius;
            deezer_frame = '<iframe title="' + frame_title + '" src="//widget.deezer.com/widget/' + embed_theme + '/' + embed_type + '/' + deezer_id + '?' + params + '" ' + frame_width + frame_height + ' ' + (allowfullscreen === '0' ? '' : ' webkitallowfullscreen mozallowfullscreen allowfullscreen') + '></iframe>';
            return deezer_frame;
        });
    },
    "fallback": function () {
        let id = 'deezer';
        TarteAuCitron.fallback(['deezer_player'], function (elem) {
            elem.style.width = elem.getAttribute('width') + 'px';
            elem.style.height = elem.getAttribute('height') + 'px';
            return TarteAuCitron.engage(id);
        });
    }
};

// leadforensics
export let leadforensics = {
    "key": "leadforensics",
    "type": "analytic",
    "name": "LeadForensics",
    "uri": "https://www.leadforensics.com/privacy-policy/",
    "needConsent": true,
    "options": {},
    "cookies": ['trackalyzer'],
    "js": function () {
        if (this.options.leadforensicsSf14gv === undefined ||
            this.options.leadforensicsIidentifier === undefined) {
            return;
        }

        window.sf14gv = this.options.leadforensicsSf14gv;

        (function () {
            let sf14g = document.createElement('script'); sf14g.async = true;
            sf14g.src = ('https:' === document.location.protocol ? 'https://' : 'http://') + 't.sf14g.com/sf14g.js';
            let s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(sf14g, s);
        })();

        TarteAuCitron.addScript('//secure.leadforensics.com/js/' + this.options.leadforensicsIidentifier + '.js');
    }
};

// disqus
export let disqus = {
    "key": "disqus",
    "type": "comment",
    "name": "Disqus",
    "uri": "https://help.disqus.com/customer/portal/articles/466259-privacy-policy",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        if (this.options.disqusShortname === undefined) {
            return;
        }
        TarteAuCitron.addScript('//' + this.options.disqusShortname + '.disqus.com/embed.js');
        TarteAuCitron.addScript('//' + this.options.disqusShortname + '.disqus.com/count.js');
    },
    "fallback": function () {
        let id = 'disqus';

        if (document.getElementById('disqus_thread')) {
            document.getElementById('disqus_thread').innerHTML = TarteAuCitron.engage(id);
        }
    }
};

// ekomi
export let ekomi = {
    "key": "ekomi",
    "type": "social",
    "name": "eKomi",
    "uri": "http://www.ekomi-us.com/us/privacy/",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        if (this.options.ekomiCertId === undefined) {
            return;
        }
        window.eKomiIntegrationConfig = [
            { certId: this.options.ekomiCertId }
        ];
        TarteAuCitron.addScript('//connect.ekomi.de/integration_1410173009/' + this.options.ekomiCertId + '.js');
    }
};

// etracker
export let etracker = {
    "key": "etracker",
    "type": "analytic",
    "name": "eTracker",
    "uri": "https://www.etracker.com/en/data-protection.html",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        if (this.options.etracker === undefined) {
            return;
        }

        TarteAuCitron.addScript('//static.etracker.com/code/e.js', '_etLoader', function () { }, true, "data-secure-code", this.options.etracker);
    }
};

// facebook
export let facebook = {
    "key": "facebook",
    "type": "social",
    "name": "Facebook",
    "uri": "https://www.facebook.com/policy.php",
    "needConsent": true,
    "options": {},
    "cookies": ['xs', 'sb', 'fr', 'datr', 'dpr', 'c_user'],
    "js": function () {
        TarteAuCitron.fallback(['fb-post', 'fb-follow', 'fb-activity', 'fb-send', 'fb-share-button', 'fb-like', 'fb-video'], '');
        TarteAuCitron.addScript('//connect.facebook.net/' + TarteAuCitron.getLocale() + '/sdk.js#xfbml=1&version=v2.0', 'facebook-jssdk');
        if (TarteAuCitron.isAjax === true) {
            if (typeof FB !== "undefined") {
                FB.XFBML.parse();
            }
        }
    },
    "fallback": function () {
        let id = 'facebook';
        TarteAuCitron.fallback(['fb-post', 'fb-follow', 'fb-activity', 'fb-send', 'fb-share-button', 'fb-like', 'fb-video'], TarteAuCitron.engage(id));
    }
};

// facebooklikebox
export let facebooklikebox = {
    "key": "facebooklikebox",
    "type": "social",
    "name": "Facebook (like box)",
    "uri": "https://www.facebook.com/policy.php",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        TarteAuCitron.fallback(['fb-like-box', 'fb-page'], '');
        TarteAuCitron.addScript('//connect.facebook.net/' + TarteAuCitron.getLocale() + '/sdk.js#xfbml=1&version=v2.3', 'facebook-jssdk');
        if (TarteAuCitron.isAjax === true) {
            if (typeof FB !== "undefined") {
                FB.XFBML.parse();
            }
        }
    },
    "fallback": function () {
        let id = 'facebooklikebox';
        TarteAuCitron.fallback(['fb-like-box', 'fb-page'], TarteAuCitron.engage(id));
    }
};

// facebookcomment
export let facebookcomment = {
    "key": "facebookcomment",
    "type": "comment",
    "name": "Facebook (commentaire)",
    "uri": "https://www.facebook.com/policy.php",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        TarteAuCitron.fallback(['fb-comments'], '');
        TarteAuCitron.addScript('//connect.facebook.net/' + TarteAuCitron.getLocale() + '/sdk.js#xfbml=1&version=v2.0', 'facebook-jssdk');
        if (TarteAuCitron.isAjax === true) {
            if (typeof FB !== "undefined") {
                FB.XFBML.parse();
            }
        }
    },
    "fallback": function () {
        let id = 'facebookcomment';
        TarteAuCitron.fallback(['fb-comments'], TarteAuCitron.engage(id));
    }
};

// ferank
export let ferank = {
    "key": "ferank",
    "type": "analytic",
    "name": "FERank",
    "uri": "https://www.ferank.fr/respect-vie-privee/#mesureaudience",
    "needConsent": false,
    "options": {},
    "cookies": [],
    "js": function () {
        TarteAuCitron.addScript('//static.ferank.fr/pixel.js', '', function () {
            if (typeof this.options.ferankMore === 'function') {
                this.options.ferankMore();
            }
        });
    }
};

// pingdom
export let pingdom = {
    "key": "pingdom",
    "type": "api",
    "name": "Pingdom",
    "uri": "https://www.solarwinds.com/general-data-protection-regulation-cloud",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {

        if (this.options.pingdomId === undefined) {
            return;
        }

        window._prum = [['id', this.options.pingdomId], ['mark', 'firstbyte', (new Date()).getTime()]];

        TarteAuCitron.addScript('https://rum-static.pingdom.net/prum.min.js');
    }
};


// simpleanalytics
export let simpleanalytics = {
    "key": "simpleanalytics",
    "type": "analytic",
    "name": "Simple Analytics",
    "uri": "https://docs.simpleanalytics.com/what-we-collect",
    "needConsent": false,
    "options": {},
    "cookies": [],
    "js": function () {
        TarteAuCitron.addScript('https://scripts.simpleanalyticscdn.com/latest.js');
    }
};

// stonly
export let stonly = {
    "key": "stonly",
    "type": "api",
    "name": "Stonly",
    "uri": "https://stonly.com/privacy",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        if (this.options.stonlyId === undefined) {
            return;
        }

        window.STONLY_WID = this.options.stonlyId;
        window.StonlyWidget || ((window.w = window.StonlyWidget = function () {
            window.w._api ? window.w._api.apply(window.w, arguments) : window.w.queue.push(arguments)
        }).queue = []);

        TarteAuCitron.addScript('https://stonly.com/js/widget/v2/stonly-widget.js?v=' + Date.now());
    }
};

// stripe
/*export let stripe = {
    "key": "stripe",
    "type": "api",
    "name": "Stripe",
    "uri": "https://stripe.com/cookies-policy/legal",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        TarteAuCitron.addScript('https://js.stripe.com/v3/');
    }
};*/

// ferank pub
export let ferankpub = {
    "key": "ferankpub",
    "type": "ads",
    "name": "FERank (pub)",
    "uri": "https://www.ferank.fr/respect-vie-privee/#regiepublicitaire",
    "needConsent": false,
    "options": {},
    "cookies": [],
    "js": function () {
        TarteAuCitron.addScript('//static.ferank.fr/publicite.async.js');
        if (TarteAuCitron.isAjax === true) {
            if (typeof ferankReady === 'function') {
                ferankReady();
            }
        }
    },
    "fallback": function () {
        let id = 'ferankpub';
        TarteAuCitron.fallback(['ferank-publicite'], TarteAuCitron.engage(id));
    }
};

// get+
export let getplus = {
    "key": "getplus",
    "type": "analytic",
    "name": "Get+",
    "uri": "http://www.getplus.fr/Conditions-generales-de-vente_a226.html",
    "needConsent": true,
    "options": {},
    "cookies": [], // ['_first_pageview', '_jsuid', 'no_trackyy_' + this.options.getplusId, '_eventqueue'],
    "js": function () {
        if (this.options.getplusId === undefined) {
            return;
        }

        window.webleads_site_ids = window.webleads_site_ids || [];
        window.webleads_site_ids.push(this.options.getplusId);
        TarteAuCitron.addScript('//stats.webleads-tracker.com/js');
    }
};

// google+
export let gplus = {
    "key": "gplus",
    "type": "social",
    "name": "Google+",
    "uri": "https://policies.google.com/privacy",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        TarteAuCitron.addScript('https://apis.google.com/js/platform.js');
    },
    "fallback": function () {
        let id = 'gplus';
        TarteAuCitron.fallback(['g-plus', 'g-plusone'], TarteAuCitron.engage(id));
    }
};

// google+ badge
export let gplusbadge = {
    "key": "gplusbadge",
    "type": "social",
    "name": "Google+ (badge)",
    "uri": "https://policies.google.com/privacy",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        TarteAuCitron.addScript('https://apis.google.com/js/platform.js');
    },
    "fallback": function () {
        let id = 'gplusbadge';
        TarteAuCitron.fallback(['g-page', 'g-person'], TarteAuCitron.engage(id));
    }
};

// google adsense
export let adsense = {
    "key": "adsense",
    "type": "ads",
    "name": "Google Adsense",
    "uri": "https://adssettings.google.com/",
    "needConsent": true,
    "readmoreLink": "https://policies.google.com/technologies/partner-sites",
    "options": {},
    "cookies": [],
    "js": function () {
        TarteAuCitron.addScript('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js');
    },
    "fallback": function () {
        let id = 'adsense';
        TarteAuCitron.fallback(['adsbygoogle'], TarteAuCitron.engage(id));
    }
};

// google partners badge
export let googlepartners = {
    "key": "googlepartners",
    "type": "ads",
    "name": "Google Partners Badge",
    "uri": "https://adssettings.google.com/",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        TarteAuCitron.addScript('https://apis.google.com/js/platform.js');
    },
    "fallback": function () {
        let id = 'googlepartners';
        TarteAuCitron.fallback(['g-partnersbadge'], TarteAuCitron.engage(id));
    }
};

// google adsense search (form)
export let adsensesearchform = {
    "key": "adsensesearchform",
    "type": "ads",
    "name": "Google Adsense Search (form)",
    "uri": "https://adssettings.google.com/",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        TarteAuCitron.addScript('//www.google.com/coop/cse/brand?form=cse-search-box&lang=' + TarteAuCitron.getLanguage());
    }
};

// google adsense search (result)
export let adsensesearchresult = {
    "key": "adsensesearchresult",
    "type": "ads",
    "name": "Google Adsense Search (result)",
    "uri": "https://adssettings.google.com/",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        if (this.options.adsensesearchresultCx === undefined) {
            return;
        }
        TarteAuCitron.addScript('//www.google.com/cse/cse.js?cx=' + this.options.adsensesearchresultCx);
    },
    "fallback": function () {
        let id = 'adsensesearchresult';

        if (document.getElementById('gcse_searchresults')) {
            document.getElementById('gcse_searchresults').innerHTML = TarteAuCitron.engage(id);
        }
    }
};

// googleadwordsconversion
export let googleadwordsconversion = {
    "key": "googleadwordsconversion",
    "type": "ads",
    "name": "Google Adwords (conversion)",
    "uri": "https://www.google.com/settings/ads",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        if (this.options.adwordsconversionId === undefined) {
            return;
        }

        TarteAuCitron.addScript('//www.googleadservices.com/pagead/conversion_async.js', '', function () {
            window.google_trackConversion({
                google_conversion_id: this.options.adwordsconversionId,
                google_conversion_label: this.options.adwordsconversionLabel,
                google_conversion_language: this.options.adwordsconversionLanguage,
                google_conversion_format: this.options.adwordsconversionFormat,
                google_conversion_color: this.options.adwordsconversionColor,
                google_conversion_value: this.options.adwordsconversionValue,
                google_conversion_currency: this.options.adwordsconversionCurrency,
                google_custom_params: {
                    parameter1: this.options.adwordsconversionCustom1,
                    parameter2: this.options.adwordsconversionCustom2
                }
            });
        });
    }
};

// googleadwordsremarketing
export let googleadwordsremarketing = {
    "key": "googleadwordsremarketing",
    "type": "ads",
    "name": "Google Adwords (remarketing)",
    "uri": "https://www.google.com/settings/ads",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        if (this.options.adwordsremarketingId === undefined) {
            return;
        }

        TarteAuCitron.addScript('//www.googleadservices.com/pagead/conversion_async.js', '', function () {
            window.google_trackConversion({
                google_conversion_id: this.options.adwordsremarketingId,
                google_remarketing_only: true
            });
        });
    }
};

// google analytics (old)
export let gajs = {
    "key": "gajs",
    "type": "analytic",
    "name": "Google Analytics (ga.js)",
    "uri": "https://policies.google.com/privacy",
    "needConsent": true,
    "options": {},
    "cookies": function () {
        let googleIdentifier = this.options.gajsUa,
            tagUaCookie = '_gat_gtag_' + googleIdentifier,
            tagGCookie = '_ga_' + googleIdentifier;

        tagUaCookie = tagUaCookie.replace(/-/g, '_');
        tagGCookie = tagGCookie.replace(/G-/g, '');

        return ['_ga', '_gat', '_gid', '__utma', '__utmb', '__utmc', '__utmt', '__utmz', tagUaCookie, tagGCookie];
    },
    "js": function () {
        window._gaq = window._gaq || [];
        window._gaq.push(['_setAccount', this.options.gajsUa]);

        if (this.options.gajsAnonymizeIp) {
            window._gaq.push(['_gat._anonymizeIp']);
        }

        if (this.options.gajsPageView) {
            window._gaq.push(['_trackPageview, ' + this.options.gajsPageView]);
        } else {
            window._gaq.push(['_trackPageview']);
        }

        TarteAuCitron.addScript('//www.google-analytics.com/ga.js', '', function () {
            if (typeof this.options.gajsMore === 'function') {
                this.options.gajsMore();
            }
        });
    }
};

// google analytics
export let analytics = {
    "key": "analytics",
    "type": "analytic",
    "name": "Google Analytics (universal)",
    "uri": "https://policies.google.com/privacy",
    "needConsent": true,
    "options": {},
    "cookies": function () {
        let googleIdentifier = this.options.analyticsUa,
            tagUaCookie = '_gat_gtag_' + googleIdentifier,
            tagGCookie = '_ga_' + googleIdentifier;

        tagUaCookie = tagUaCookie.replace(/-/g, '_');
        tagGCookie = tagGCookie.replace(/G-/g, '');

        return ['_ga', '_gat', '_gid', '__utma', '__utmb', '__utmc', '__utmt', '__utmz', tagUaCookie, tagGCookie];
    },
    "js": function () {
        window.GoogleAnalyticsObject = 'ga';
        window.ga = window.ga || function () {
            window.ga.q = window.ga.q || [];
            window.ga.q.push(arguments);
        };
        window.ga.l = new Date();
        TarteAuCitron.addScript('https://www.google-analytics.com/analytics.js', '', function () {
            let uaCreate = { 'cookieExpires': 34128000 };
            TarteAuCitron.extend(uaCreate, this.options.analyticsUaCreate || {});
            ga('create', this.options.analyticsUa, uaCreate);

            if (this.options.analyticsAnonymizeIp) {
                ga('set', 'anonymizeIp', true);
            }

            if (typeof this.options.analyticsPrepare === 'function') {
                this.options.analyticsPrepare();
            }

            if (this.options.analyticsPageView) {
                ga('send', 'pageview', this.options.analyticsPageView);
            } else {
                ga('send', 'pageview');
            }

            if (typeof this.options.analyticsMore === 'function') {
                this.options.analyticsMore();
            }
        });
    }
};

// google analytics
export let gtag = {
    "key": "gtag",
    "type": "analytic",
    "name": "Google Analytics (gtag.js)",
    "uri": "https://policies.google.com/privacy",
    "needConsent": true,
    "options": {},
    "cookies": function () {
        let googleIdentifier = this.options.gtagUa,
            tagUaCookie = '_gat_gtag_' + googleIdentifier,
            tagGCookie = '_ga_' + googleIdentifier;

        tagUaCookie = tagUaCookie.replace(/-/g, '_');
        tagGCookie = tagGCookie.replace(/G-/g, '');

        return ['_ga', '_gat', '_gid', '__utma', '__utmb', '__utmc', '__utmt', '__utmz', tagUaCookie, tagGCookie];
    },
    "js": function () {
        window.dataLayer = window.dataLayer || [];
        let options = this.options;
        TarteAuCitron.addScript('https://www.googletagmanager.com/gtag/js?id=' + this.options.gtagUa, '', function () {
            let gtag = function gtag() { dataLayer.push(arguments); }
            window.gtag = gtag;
            console.log(arguments);
            gtag('js', new Date());

            if (options.gtagCrossdomain) {
                /**
                 * https://support.google.com/analytics/answer/7476333?hl=en
                 * https://developers.google.com/analytics/devguides/collection/gtagjs/cross-domain
                 */
                gtag('config', options.gtagUa, { 'anonymize_ip': true }, { linker: { domains: options.gtagCrossdomain, } });
            } else {
                gtag('config', options.gtagUa, { 'anonymize_ip': true });
            }

            if (typeof options.gtagMore === 'function') {
                options.gtagMore();
            }
        });
    }
};

export let firebase = {
    "key": "firebase",
    "type": "analytic",
    "name": "Firebase",
    "uri": "https://firebase.google.com/support/privacy",
    "needConsent": true,
    "options": {},
    "cookies": function () {
        let googleIdentifier = this.options.firebaseMeasurementId,
            tagGCookie = '_ga_' + googleIdentifier;

        tagGCookie = tagGCookie.replace(/G-/g, '');

        return ['_ga', tagGCookie];
    },
    "js": function () {

        if (this.options.firebaseApiKey === undefined) {
            return;
        }

        TarteAuCitron.addScript('https://www.gstatic.com/firebasejs/8.6.2/firebase-app.js', '', function () {
            TarteAuCitron.addScript('https://www.gstatic.com/firebasejs/8.6.2/firebase-analytics.js', '', function () {

                let firebaseConfig = {
                    apiKey: this.options.firebaseApiKey,
                    authDomain: this.options.firebaseAuthDomain,
                    databaseURL: this.options.firebaseDatabaseUrl,
                    projectId: this.options.firebaseProjectId,
                    storageBucket: this.options.firebaseStorageBucket,
                    appId: this.options.firebaseAppId,
                    measurementId: this.options.firebaseMeasurementId,
                };
                firebase.initializeApp(firebaseConfig);
                firebase.analytics();
            });
        });
    }
};

// genially
export let genially = {
    "key": "genially",
    "type": "api",
    "name": "genially",
    "uri": "https://www.genial.ly/cookies",
    "needConsent": true,
    "options": {},
    "cookies": ['_gat', '_ga', '_gid'],
    "js": function () {

        TarteAuCitron.fallback(['tac_genially'], function (x) {
            let frame_title = TarteAuCitron.fixSelfXSS(x.getAttribute("title") || 'genially iframe'),
                width = x.getAttribute("width"),
                height = x.getAttribute("height"),
                geniallyid = x.getAttribute("geniallyid"),
                allowfullscreen = x.getAttribute("allowfullscreen");

            return '<div style="position: relative; padding-bottom: 109.00%; padding-top: 0; height: 0;"><iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" title="' + frame_title + '" src="https://view.genial.ly/' + geniallyid + '" width="' + width + '" height="' + height + '" scrolling="auto" allowtransparency ' + (allowfullscreen === '0' ? '' : ' webkitallowfullscreen mozallowfullscreen allowfullscreen') + '></iframe></div>';
        });
    },
    "fallback": function () {
        let id = 'genially';
        TarteAuCitron.fallback(['tac_genially'], function (elem) {
            elem.style.width = elem.getAttribute('width') + 'px';
            elem.style.height = elem.getAttribute('height') + 'px';
            return TarteAuCitron.engage(id);
        });
    }
};

// google maps
export let googlemaps = {
    "key": "googlemaps",
    "type": "api",
    "name": "Google Maps",
    "uri": "https://policies.google.com/privacy",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        let mapOptions,
            map,
            uniqIds = [],
            i;

        if (this.options.mapscallback === undefined) {
            this.options.mapscallback = 'tac_googlemaps_callback';
        }

        // Add Google Maps libraries if any (https://developers.google.com/maps/documentation/javascript/libraries)
        let googleMapsLibraries = '';
        if (this.options.googlemapsLibraries) {
            googleMapsLibraries = '&libraries=' + this.options.googlemapsLibraries;
        }

        TarteAuCitron.addScript('//maps.googleapis.com/maps/api/js?v=3.exp&key=' + this.options.googlemapsKey + '&callback=' + this.options.mapscallback + googleMapsLibraries);

        window.tac_googlemaps_callback = function () {
            TarteAuCitron.fallback(['googlemaps-canvas'], function (x) {
                let uniqId = '_' + Math.random().toString(36).substr(2, 9);
                uniqIds.push(uniqId);
                return '<div id="' + uniqId + '" zoom="' + x.getAttribute('zoom') + '" latitude="' + x.getAttribute('latitude') + '" longitude="' + x.getAttribute('longitude') + '" style="width:' + x.offsetWidth + 'px;height:' + x.offsetHeight + 'px"></div>';
            });

            let i;
            for (i = 0; i < uniqIds.length; i += 1) {
                mapOptions = {
                    zoom: parseInt(document.getElementById(uniqIds[i]).getAttribute('zoom'), 10),
                    center: new google.maps.LatLng(parseFloat(document.getElementById(uniqIds[i]).getAttribute('latitude'), 10), parseFloat(document.getElementById(uniqIds[i]).getAttribute('longitude'), 10))
                };
                map = new google.maps.Map(document.getElementById(uniqIds[i]), mapOptions);
                new google.maps.Marker({ position: { lat: parseFloat(document.getElementById(uniqIds[i]).getAttribute('latitude'), 10), lng: parseFloat(document.getElementById(uniqIds[i]).getAttribute('longitude'), 10) }, map: map });
            }
        };
    },
    "fallback": function () {
        let id = 'googlemaps';
        TarteAuCitron.fallback(['googlemaps-canvas'], TarteAuCitron.engage(id));
    }
};

// googlemaps search
export let googlemapssearch = {
    "key": "googlemapssearch",
    "type": "api",
    "name": "Google Maps Search API",
    "uri": "https://policies.google.com/privacy",
    "needConsent": true,
    "options": {},
    "cookies": ['nid'],
    "js": function () {
        TarteAuCitron.fallback(['googlemapssearch'], function (x) {
            let frame_title = TarteAuCitron.fixSelfXSS(x.getAttribute("title") || 'Google search iframe'),
                width = x.getAttribute("width"),
                height = x.getAttribute("height"),
                // url = x.getAttribute("data-url");
                query = escape(x.getAttribute("data-search")),
                key = x.getAttribute("data-api-key");

            return '<iframe title="' + frame_title + '" width="' + width + '" height="' + height + '" style="border:0" src="https://www.google.com/maps/embed/v1/place?q=' + query + '&key=' + key + '" allowfullscreen></iframe> '
        });
    },
    "fallback": function () {
        let id = 'googlemapssearch';
        TarteAuCitron.fallback(['googlemapssearch'], function (elem) {
            elem.style.width = elem.getAttribute('width') + 'px';
            elem.style.height = elem.getAttribute('height') + 'px';
            return TarteAuCitron.engage(id);
        });
    }
};

// googlemaps embed iframe
export let googlemapsembed = {
    "key": "googlemapsembed",
    "type": "api",
    "name": "Google Maps Embed",
    "uri": "https://policies.google.com/privacy",
    "needConsent": true,
    "options": {},
    "cookies": ['apisid', 'hsid', 'nid', 'sapisid', 'sid', 'sidcc', 'ssid', '1p_jar'],
    "js": function () {
        TarteAuCitron.fallback(['googlemapsembed'], function (x) {
            let frame_title = TarteAuCitron.fixSelfXSS(x.getAttribute("title") || 'Google maps iframe'),
                width = TarteAuCitron.getElemWidth(x),
                height = TarteAuCitron.getElemHeight(x),
                url = x.getAttribute("data-url");

            return '<iframe title="' + frame_title + '" src="' + url + '" width="' + width + '" height="' + height + '" scrolling="no" allowtransparency allowfullscreen></iframe>';
        });
    },
    "fallback": function () {
        let id = 'googlemapsembed';
        TarteAuCitron.fallback(['googlemapsembed'], function (elem) {
            elem.style.width = TarteAuCitron.getElemWidth(elem) + 'px';
            elem.style.height = TarteAuCitron.getElemHeight(elem) + 'px';
            return TarteAuCitron.engage(id);
        });
    }
};

// google tag manager
export let googletagmanager = {
    "key": "googletagmanager",
    "type": "api",
    "name": "Google Tag Manager",
    "uri": "https://policies.google.com/privacy",
    "needConsent": true,
    "options": {},
    "cookies": ['_ga', '_gat', '__utma', '__utmb', '__utmc', '__utmt', '__utmz', '__gads', '_drt_', 'FLC', 'exchange_uid', 'id', 'fc', 'rrs', 'rds', 'rv', 'uid', 'UIDR', 'UID', 'clid', 'ipinfo', 'acs'],
    "js": function () {
        if (this.options.googletagmanagerId === undefined) {
            return;
        }
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'gtm.start': new Date().getTime(),
            event: 'gtm.js'
        });
        TarteAuCitron.addScript('https://www.googletagmanager.com/gtm.js?id=' + this.options.googletagmanagerId);
    }
};

// google tag manager multiple
export let multiplegoogletagmanager = {
    "key": "multiplegoogletagmanager",
    "type": "api",
    "name": "Google Tag Manager",
    "uri": "https://policies.google.com/privacy",
    "needConsent": true,
    "options": {},
    "cookies": ['_ga', '_gat', '__utma', '__utmb', '__utmc', '__utmt', '__utmz', '__gads', '_drt_', 'FLC', 'exchange_uid', 'id', 'fc', 'rrs', 'rds', 'rv', 'uid', 'UIDR', 'UID', 'clid', 'ipinfo', 'acs'],
    "js": function () {
        if (this.options.multiplegoogletagmanagerId === undefined) {
            return;
        }
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'gtm.start': new Date().getTime(),
            event: 'gtm.js'
        });

        this.options.multiplegoogletagmanagerId.forEach(function (id) {
            TarteAuCitron.addScript('https://www.googletagmanager.com/gtm.js?id=' + id);
        });

    }
};

// google webfonts
export let googlefonts = {
    "key": "googlefonts",
    "type": "api",
    "name": "Google Webfonts",
    "uri": "https://policies.google.com/privacy",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        if (this.options.googleFonts === undefined) {
            return;
        }
        TarteAuCitron.addScript('//ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js', '', function () {
            WebFont.load({
                google: {
                    families: this.options.googleFonts
                }
            });
        });
    }
};

// hubspot
export let hubspot = {
    "key": "hubspot",
    "type": "analytic",
    "name": "Hubspot",
    "uri": "https://legal.hubspot.com/privacy-policy",
    "needConsent": true,
    "options": {},
    "cookies": ['hubspotutk', 'fr', '__hstc', '__hssrc', '__hssc', '__cfduid'],
    "js": function () {
        TarteAuCitron.addScript('//js.hs-scripts.com/' + this.options.hubspotId + '.js', 'hs-script-loader');
    }
};

// instagram
export let instagram = {
    "key": "instagram",
    "type": "social",
    "name": "Instagram",
    "uri": "https://www.instagram.com/legal/privacy/",
    "needConsent": true,
    "options": {},
    "cookies": ['shbts', 'sessionid', 'csrftoken', 'rur', 'shbid', 'mid', 'ds_usr_id', 'ig_did', 'ig_cb', 'datr'],
    "js": function () {
        TarteAuCitron.fallback(['instagram_post'], function (x) {
            let frame_title = TarteAuCitron.fixSelfXSS(x.getAttribute("title") || 'Instagram iframe'),
                post_id = x.getAttribute('postId'),
                post_permalink = x.getAttribute('data-instgrm-permalink'),
                embed_width = x.getAttribute('width'),
                embed_height = x.getAttribute('height'),
                frame_width,
                frame_height,
                post_frame;

            if (post_permalink != null) {
                TarteAuCitron.addScript('//www.instagram.com/embed.js', 'instagram-embed');

                return '';
            }

            if (post_id === undefined) {
                return "";
            }

            if (embed_width !== undefined) {
                frame_width = 'width="' + embed_width + '" ';
            } else {
                frame_width = '"" ';
            }
            if (embed_height !== undefined) {
                frame_height = 'height="' + embed_height + '" ';
            } else {
                frame_height = '"" ';
            }

            post_frame = '<iframe title="' + frame_title + '" src="//www.instagram.com/' + post_id + '/embed" ' + frame_width + frame_height + '></iframe>';

            return post_frame;
        });
    },
    "fallback": function () {
        let id = 'instagram';
        TarteAuCitron.fallback(['instagram_post'], function (elem) {
            elem.style.width = elem.getAttribute('width') + 'px';
            elem.style.height = elem.getAttribute('height') + 'px';
            return TarteAuCitron.engage(id);
        });
    }
};

// jsapi
export let jsapi = {
    "key": "jsapi",
    "type": "api",
    "name": "Google jsapi",
    "uri": "https://policies.google.com/privacy",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        TarteAuCitron.addScript('//www.google.com/jsapi');
    }
};

// twitterwidgetsapi
export let twitterwidgetsapi = {
    "key": "twitterwidgetsapi",
    "type": "api",
    "name": "Twitter Widgets API",
    "uri": "https://support.twitter.com/articles/20170514",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        TarteAuCitron.fallback(['tacTwitterAPI'], '');
        TarteAuCitron.addScript('//platform.twitter.com/widgets.js', 'twitter-wjs');
    },
    "fallback": function () {
        let id = 'twitterwidgetsapi';
        TarteAuCitron.fallback(['tacTwitterAPI'], TarteAuCitron.engage(id));
    }
};

// recaptcha
export let recaptcha = {
    "key": "recaptcha",
    "type": "api",
    "name": "reCAPTCHA",
    "uri": "https://policies.google.com/privacy",
    "needConsent": true,
    "options": {},
    "cookies": ['nid'],
    "js": function () {
        window.tacRecaptchaOnLoad = this.options.recaptchaOnLoad || function () { };
        TarteAuCitron.fallback(['g-recaptcha'], '');

        if (this.options.recaptchaapi === undefined) {
            TarteAuCitron.addScript('https://www.google.com/recaptcha/api.js?onload=tacRecaptchaOnLoad');
        } else {
            TarteAuCitron.addScript('https://www.google.com/recaptcha/api.js?onload=tacRecaptchaOnLoad&render=' + this.options.recaptchaapi);
        }

    },
    "fallback": function () {
        let id = 'recaptcha';
        TarteAuCitron.fallback(['g-recaptcha'], TarteAuCitron.engage(id));
    }
};

// linkedin
export let linkedin = {
    "key": "linkedin",
    "type": "social",
    "name": "Linkedin",
    "uri": "https://www.linkedin.com/legal/cookie_policy",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        TarteAuCitron.fallback(['tacLinkedin'], '');
        TarteAuCitron.addScript('//platform.linkedin.com/in.js');
        if (TarteAuCitron.isAjax === true) {
            if (typeof IN !== "undefined") {
                IN.parse();
            }
        }
    },
    "fallback": function () {
        let id = 'linkedin';
        TarteAuCitron.fallback(['tacLinkedin'], TarteAuCitron.engage(id));
    }
};

// mautic
export let mautic = {
    "key": "mautic",
    "type": "analytic",
    "name": "Mautic",
    "uri": "https://www.mautic.org/privacy-policy/",
    "needConsent": true,
    "options": {},
    "cookies": ['mtc_id', 'mtc_sid'],
    "js": function () {
        if (this.options.mauticurl === undefined) {
            return;
        }

        window.MauticTrackingObject = 'mt';
        window.mt = window.mt || function () {
            window.mt.q = window.mt.q || [];
            window.mt.q.push(arguments);
        };

        TarteAuCitron.addScript(this.options.mauticurl, '', function () {
            mt('send', 'pageview');
        });
    }
};

// microsoftcampaignanalytics
export let microsoftcampaignanalytics = {
    "key": "microsoftcampaignanalytics",
    "type": "analytic",
    "name": "Microsoft Campaign Analytics",
    "uri": "https://privacy.microsoft.com/privacystatement/",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        if (this.options.microsoftcampaignanalyticsUUID === undefined) {
            return;
        }

        TarteAuCitron.addScript('//flex.atdmt.com/mstag/site/' + this.options.microsoftcampaignanalyticsUUID + '/mstag.js', 'mstag_tops', function () {
            window.mstag = { loadTag: function () { }, time: (new Date()).getTime() };
            window.mstag.loadTag("analytics", { dedup: "1", domainId: this.options.microsoftcampaignanalyticsdomainId, type: "1", actionid: this.options.microsoftcampaignanalyticsactionId });
        });
    }
};

// onesignal
export let onesignal = {
    "key": "onesignal",
    "type": "api",
    "name": "OneSignal",
    "uri": "https://onesignal.com/privacy_policy",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        if (this.options.onesignalAppId === undefined) {
            return;
        }
        window.OneSignal = window.OneSignal || [];

        window.OneSignal.push(function () {
            window.OneSignal.init({
                appId: this.options.onesignalAppId,
            });
        });

        TarteAuCitron.addScript('https://cdn.onesignal.com/sdks/OneSignalSDK.js');
    }
};

// pinterest
export let pinterest = {
    "key": "pinterest",
    "type": "social",
    "name": "Pinterest",
    "uri": "https://about.pinterest.com/privacy-policy",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        TarteAuCitron.fallback(['tacPinterest'], '');
        TarteAuCitron.addScript('//assets.pinterest.com/js/pinit.js');
    },
    "fallback": function () {
        let id = 'pinterest';
        TarteAuCitron.fallback(['tacPinterest'], TarteAuCitron.engage(id));
    }
};

// prelinker
export let prelinker = {
    "key": "prelinker",
    "type": "ads",
    "name": "Prelinker",
    "uri": "http://www.prelinker.com/index/index/cgu/",
    "needConsent": true,
    "options": {},
    "cookies": ['_sp_id.32f5', '_sp_ses.32f5'],
    "js": function () {
        let uniqIds = [],
            i,
            uri;

        TarteAuCitron.fallback(['prelinker-canvas'], function (x) {
            let uniqId = '_' + Math.random().toString(36).substr(2, 9);
            uniqIds.push(uniqId);
            return '<div id="' + uniqId + '" siteId="' + x.getAttribute('siteId') + '" bannerId="' + x.getAttribute('bannerId') + '" defaultLanguage="' + x.getAttribute('defaultLanguage') + '" tracker="' + x.getAttribute('tracker') + '"></div>';
        });

        for (i = 0; i < uniqIds.length; i += 1) {
            uri = 'http://promo.easy-dating.org/banner/index?';
            uri += 'site_id=' + document.getElementById(uniqIds[i]).getAttribute('siteId') + '&';
            uri += 'banner_id=' + document.getElementById(uniqIds[i]).getAttribute('bannerId') + '&';
            uri += 'default_language=' + document.getElementById(uniqIds[i]).getAttribute('defaultLanguage') + '&';
            uri += 'tr4ck=' + document.getElementById(uniqIds[i]).getAttribute('trackrt');

            TarteAuCitron.makeAsync.init(uri, uniqIds[i]);
        }
    },
    "fallback": function () {
        let id = 'prelinker';
        TarteAuCitron.fallback(['prelinker-canvas'], TarteAuCitron.engage(id));
    }
};

// prezi
export let prezi = {
    "key": "prezi",
    "type": "video",
    "name": "Prezi",
    "uri": "https://prezi.com/privacy-policy/",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        TarteAuCitron.fallback(['prezi-canvas'], function (x) {
            let frame_title = TarteAuCitron.fixSelfXSS(x.getAttribute("title") || 'Prezi iframe'),
                id = x.getAttribute("data-id"),
                width = x.getAttribute("width"),
                height = x.getAttribute("height"),
                url = 'https://prezi.com/embed/' + id + '/?bgcolor=ffffff&amp;lock_to_path=0&amp;autoplay=0&amp;autohide_ctrls=0';

            return '<iframe title="' + frame_title + '" src="' + url + '" width="' + width + '" height="' + height + '" scrolling="no" allowtransparency allowfullscreen></iframe>';
        });
    },
    "fallback": function () {
        let id = 'prezi';
        TarteAuCitron.fallback(['prezi-canvas'], function (elem) {
            elem.style.width = elem.getAttribute('width') + 'px';
            elem.style.height = elem.getAttribute('height') + 'px';
            return TarteAuCitron.engage(id);
        });
    }
};

// pubdirecte
export let pubdirecte = {
    "key": "pubdirecte",
    "type": "ads",
    "name": "Pubdirecte",
    "uri": "http://pubdirecte.com/contact.php",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        let uniqIds = [],
            i,
            uri;

        TarteAuCitron.fallback(['pubdirecte-canvas'], function (x) {
            let uniqId = '_' + Math.random().toString(36).substr(2, 9);
            uniqIds.push(uniqId);
            return '<div id="' + uniqId + '" pid="' + x.getAttribute('pid') + '" ref="' + x.getAttribute('ref') + '"></div>';
        });

        for (i = 0; i < uniqIds.length; i += 1) {
            uri = '//www.pubdirecte.com/script/banniere.php?';
            uri += 'id=' + document.getElementById(uniqIds[i]).getAttribute('pid') + '&';
            uri += 'ref=' + document.getElementById(uniqIds[i]).getAttribute('ref');

            TarteAuCitron.makeAsync.init(uri, uniqIds[i]);
        }
    },
    "fallback": function () {
        let id = 'pubdirecte';
        TarteAuCitron.fallback(['pubdirecte-canvas'], TarteAuCitron.engage(id));
    }
};

// purechat
export let purechat = {
    "key": "purechat",
    "type": "support",
    "name": "PureChat",
    "uri": "https://www.purechat.com/privacy",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        if (this.options.purechatId === undefined) {
            return;
        }

        TarteAuCitron.addScript('//app.purechat.com/VisitorWidget/WidgetScript', '', function () {
            try {
                window.w = new PCWidget({ c: this.options.purechatId, f: true });
            } catch (e) { }
        });
    }
};

// Intercom
export let intercomChat = {
    "key": "intercomChat",
    "type": "support",
    "name": "Intercom",
    "uri": "https://www.intercom.com/",
    "needConsent": true,
    "options": {},
    "cookies": [
        /*"intercom-id-" + this.options.intercomKey,
        "intercom-session-" + this.options.intercomKey,*/
    ],
    "readmoreLink": "https://www.intercom.com/legal/privacy",
    "js": function () {
        window.intercomSettings = {
            app_id: this.options.intercomKey,
        };

        let w = window;
        let ic = w.Intercom;
        if (typeof ic === "function") {
            ic("reattach_activator");
            ic("update", w.intercomSettings);
        } else {
            let i = function () {
                i.c(arguments);
            };
            i.q = [];
            i.c = function (args) {
                i.q.push(args);
            };
            w.Intercom = i;
            TarteAuCitron.addScript(
                "https://widget.intercom.io/widget/" + this.options.intercomKey,
                "",
                function () {
                    // Execute callback if function `intercomChatEnable`
                    // is defined
                    if (typeof intercomChatEnable === 'function') {
                        intercomChatEnable()
                    }
                }
            );
        }
    },
    "fallback": function () {
        let id = "intercomChat";
        TarteAuCitron.fallback(
            ["intercom-chat"],
            function () {
                // Execute callback if function `intercomChatDisable`
                // is defined
                if (typeof intercomChatDisable === 'function') {
                    intercomChatDisable()
                }
                return TarteAuCitron.engage(id)
            }
        );
    },
};

// rumbletalk
export let rumbletalk = {
    "key": "rumbletalk",
    "type": "social",
    "name": "RumbleTalk",
    "needConsent": true,
    "options": {},
    "cookies": ['AWSALB'],
    "js": function () {
        if (this.options.rumbletalkid === undefined) {
            return;
        }

        TarteAuCitron.addScript('https://rumbletalk.com/client/?' + this.options.rumbletalkid);

        TarteAuCitron.fallback(['rumbletalk'], function (x) {
            let width = TarteAuCitron.getElemWidth(x),
                height = TarteAuCitron.getElemHeight(x),
                id = x.getAttribute("data-id");

            return '<div style="height: ' + height + 'px; width: ' + width + 'px;"><div id="' + id + '"></div></div>';
        });
    },
    "fallback": function () {
        let id = 'rumbletalk';
        TarteAuCitron.fallback(['rumbletalk'], function (elem) {
            elem.style.width = TarteAuCitron.getElemWidth(elem) + 'px';
            elem.style.height = TarteAuCitron.getElemHeight(elem) + 'px';

            return TarteAuCitron.engage(id);
        });
    }
};

// shareaholic
export let shareaholic = {
    "key": "shareaholic",
    "type": "social",
    "name": "Shareaholic",
    "uri": "https://shareaholic.com/privacy/choices",
    "needConsent": true,
    "options": {},
    "cookies": ['__utma', '__utmb', '__utmc', '__utmz', '__utmt_Shareaholic%20Pageviews'],
    "js": function () {
        if (this.options.shareaholicSiteId === undefined) {
            return;
        }

        TarteAuCitron.fallback(['shareaholic-canvas'], '');
        TarteAuCitron.addScript('//dsms0mj1bbhn4.cloudfront.net/assets/pub/shareaholic.js', '', function () {
            try {
                Shareaholic.init(this.options.shareaholicSiteId);
            } catch (e) { }
        });
    },
    "fallback": function () {
        let id = 'shareaholic';
        TarteAuCitron.fallback(['shareaholic-canvas'], TarteAuCitron.engage(id));
    }
};

// shareasale
export let shareasale = {
    "key": "shareasale",
    "type": "ads",
    "name": "ShareASale",
    "uri": "https://www.shareasale.com/PrivacyPolicy.pdf",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        let uniqIds = [],
            i,
            uri;

        TarteAuCitron.fallback(['shareasale-canvas'], function (x) {
            let uniqId = '_' + Math.random().toString(36).substr(2, 9);
            uniqIds.push(uniqId);
            return '<div id="' + uniqId + '" amount="' + x.getAttribute('amount') + '" tracking="' + x.getAttribute('tracking') + '" transtype="' + x.getAttribute('transtype') + '" persale="' + x.getAttribute('persale') + '" perlead="' + x.getAttribute('perlead') + '" perhit="' + x.getAttribute('perhit') + '" merchantID="' + x.getAttribute('merchantID') + '"></div>';
        });

        for (i = 0; i < uniqIds.length; i += 1) {
            uri = 'https://shareasale.com/sale.cfm?';
            uri += 'amount=' + document.getElementById(uniqIds[i]).getAttribute('amount') + '&';
            uri += 'tracking=' + document.getElementById(uniqIds[i]).getAttribute('tracking') + '&';
            uri += 'transtype=' + document.getElementById(uniqIds[i]).getAttribute('transtype') + '&';
            uri += 'persale=' + document.getElementById(uniqIds[i]).getAttribute('persale') + '&';
            uri += 'perlead=' + document.getElementById(uniqIds[i]).getAttribute('perlead') + '&';
            uri += 'perhit=' + document.getElementById(uniqIds[i]).getAttribute('perhit') + '&';
            uri += 'merchantID=' + document.getElementById(uniqIds[i]).getAttribute('merchantID');

            document.getElementById(uniqIds[i]).innerHTML = '<img src=\'' + uri + '\' width=\'1\' height=\'1\' />';
        }
    },
    "fallback": function () {
        let id = 'shareasale';
        TarteAuCitron.fallback(['shareasale-canvas'], TarteAuCitron.engage(id));
    }
};

// sharethis
export let sharethis = {
    "key": "sharethis",
    "type": "social",
    "name": "ShareThis",
    "uri": "http://www.sharethis.com/legal/privacy/",
    "needConsent": true,
    "options": {},
    "cookies": ['__unam'],
    "js": function () {
        if (this.options.sharethisPublisher === undefined) {
            return;
        }
        let switchTo5x = true,
            uri = ('https:' === document.location.protocol ? 'https://ws' : 'http://w') + '.sharethis.com/button/buttons.js';

        TarteAuCitron.fallback(['tacSharethis'], '');
        TarteAuCitron.addScript(uri, '', function () {
            stLight.options({ publisher: this.options.sharethisPublisher, doNotHash: false, doNotCopy: false, hashAddressBar: false });
        });

        if (TarteAuCitron.isAjax === true) {
            if (typeof stButtons !== "undefined") {
                stButtons.locateElements();
            }
        }
    },
    "fallback": function () {
        let id = 'sharethis';
        TarteAuCitron.fallback(['tacSharethis'], TarteAuCitron.engage(id));
    }
};

// slideshare
export let slideshare = {
    "key": "slideshare",
    "type": "video",
    "name": "SlideShare",
    "uri": "https://www.linkedin.com/legal/privacy-policy",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        TarteAuCitron.fallback(['slideshare-canvas'], function (x) {
            let frame_title = TarteAuCitron.fixSelfXSS(x.getAttribute("title") || 'Slideshare iframe'),
                id = x.getAttribute("data-id"),
                width = x.getAttribute("width"),
                height = x.getAttribute("height"),
                url = '//www.slideshare.net/slideshow/embed_code/' + id;

            return '<iframe title="' + frame_title + '" src="' + url + '" width="' + width + '" height="' + height + '" scrolling="no" allowtransparency allowfullscreen></iframe>';
        });
    },
    "fallback": function () {
        let id = 'slideshare';
        TarteAuCitron.fallback(['slideshare-canvas'], function (elem) {
            elem.style.width = elem.getAttribute('width') + 'px';
            elem.style.height = elem.getAttribute('height') + 'px';
            return TarteAuCitron.engage(id);
        });
    }
};

// soundcloud
export let soundcloud = {
    key: 'soundcloud',
    type: 'video',
    name: 'SoundCloud',
    needConsent: true,
    cookies: ['sc_anonymous_id', 'sclocale'],
    js: function () {
        TarteAuCitron.fallback(['soundcloud_player'], function (x) {
            let frame_title = TarteAuCitron.fixSelfXSS(x.getAttribute("title") || 'Soundcloud iframe'),
                player_height = x.getAttribute('data-height'),
                frame_height = 'height="' + player_height + '" ',
                playable_id = x.getAttribute('data-playable-id'),
                playable_type = x.getAttribute('data-playable-type'),
                playable_url = x.getAttribute('data-playable-url'),
                color = x.getAttribute('data-color'),
                autoplay = x.getAttribute('data-auto-play'),
                hideRelated = x.getAttribute('data-hide-related'),
                showComments = x.getAttribute('data-show-comments'),
                showUser = x.getAttribute('data-show-user'),
                showReposts = x.getAttribute('data-show-reposts'),
                showTeaser = x.getAttribute('data-show-teaser'),
                visual = x.getAttribute('data-visual'),
                artwork = x.getAttribute('data-artwork');

            let allowAutoplay = autoplay === 'true' ? 'allow="autoplay"' : '';

            if (playable_id === undefined && playable_url === undefined) {
                return "";
            }

            // Allow to embed from API results (playable_type + playable_id)
            let qs = '?url=https%3A//api.soundcloud.com/' + playable_type + '/' + playable_id;
            // Or from raw URL from Soundcloud website
            if (playable_url && playable_url.length > 0) qs = '?url=' + escape(playable_url);

            if (hideRelated && hideRelated.length > 0) qs += '&hide_related=' + hideRelated;
            if (color && color.length > 0) qs += '&color=' + color.replace('#', '%23');
            if (autoplay && autoplay.length > 0) qs += '&auto_play=' + autoplay;
            if (showComments && showComments.length > 0) qs += '&show_comments=' + showComments;
            if (hideRelated && hideRelated.length > 0) qs += '&hide_related=' + hideRelated;
            if (showUser && showUser.length > 0) qs += '&show_user=' + showUser;
            if (showReposts && showReposts.length > 0) qs += '&show_reposts=' + showReposts;
            if (showTeaser && showTeaser.length > 0) qs += '&show_teaser=' + showTeaser;
            if (visual && visual.length > 0) qs += '&visual=' + visual;
            if (artwork && artwork.length > 0) qs += '&show_artwork=' + artwork;

            return '<iframe title="' + frame_title + '" width="100%" ' + frame_height + ' scrolling="no" ' + allowAutoplay + ' src="https://w.soundcloud.com/player/' + qs + '"></iframe>';
        });
    },
    fallback: function () {
        TarteAuCitron.fallback(['soundcloud_player'], function (elem) {
            elem.style.height = elem.getAttribute('data-height') + 'px';
            return TarteAuCitron.engage('soundcloud');
        });
    }
};

// spotify
export let spotify = {
    "key": "spotify",
    "type": "video",
    "name": "Spotify",
    "uri": "https://www.spotify.com/us/legal/privacy-policy/",
    "needConsent": true,
    "options": {},
    "cookies": ['sp_landing', '_ga', 'sp_ab', 'sp_landingref', 'sp_t', 'sp_usid', 'OptanonConsent', 'sp_m', 'spot'],
    "js": function () {
        TarteAuCitron.fallback(['spotify_player'], function (x) {
            let frame_title = TarteAuCitron.fixSelfXSS(x.getAttribute("title") || 'Spotify iframe'),
                spotify_id = x.getAttribute("spotifyID"),
                spotify_width = x.getAttribute("width"),
                frame_width = 'width=',
                spotify_height = x.getAttribute("height"),
                frame_height = 'height=',
                spotify_frame;

            if (spotify_id === undefined) {
                return "";
            }
            if (spotify_width !== undefined) {
                frame_width += '"' + spotify_width + '" ';
            } else {
                frame_width += '"" ';
            }
            if (spotify_height !== undefined) {
                frame_height += '"' + spotify_height + '" ';
            } else {
                frame_height += '"" ';
            }
            spotify_frame = '<iframe title="' + frame_title + '" src="//open.spotify.com/embed/' + spotify_id + '" ' + frame_width + frame_height + ' allowfullscreen></iframe>';
            return spotify_frame;
        });
    },
    "fallback": function () {
        let id = 'spotify';
        TarteAuCitron.fallback(['spotify_player'], function (elem) {
            elem.style.width = elem.getAttribute('width') + 'px';
            elem.style.height = elem.getAttribute('height') + 'px';
            return TarteAuCitron.engage(id);
        });
    }
};

// statcounter
export let statcounter = {
    "key": "statcounter",
    "type": "analytic",
    "name": "StatCounter",
    "uri": "https://fr.statcounter.com/about/legal/#privacy",
    "needConsent": true,
    "options": {},
    "cookies": ['sc_is_visitor_unique'],
    "js": function () {
        let uniqIds = [],
            i,
            uri = '//statcounter.com/counter/counter.js';

        TarteAuCitron.fallback(['statcounter-canvas'], function (x) {
            let uniqId = '_' + Math.random().toString(36).substr(2, 9);
            uniqIds.push(uniqId);
            return '<div id="' + uniqId + '"></div>';
        });

        for (i = 0; i < uniqIds.length; i += 1) {
            TarteAuCitron.makeAsync.init(uri, uniqIds[i]);
        }
    },
    "fallback": function () {
        let id = 'statcounter';
        TarteAuCitron.fallback(['statcounter-canvas'], TarteAuCitron.engage(id));
    }
};

// timelinejs
export let timelinejs = {
    "key": "timelinejs",
    "type": "api",
    "name": "Timeline JS",
    "uri": "http://timeline.knightlab.com/#help",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        TarteAuCitron.fallback(['timelinejs-canvas'], function (x) {
            let frame_title = TarteAuCitron.fixSelfXSS(x.getAttribute("title") || 'Twitter iframe'),
                spreadsheet_id = x.getAttribute("spreadsheet_id"),
                width = x.getAttribute("width"),
                height = x.getAttribute("height"),
                lang = x.getAttribute("lang_2_letter"),
                font = x.getAttribute("font"),
                map = x.getAttribute("map"),
                start_at_end = x.getAttribute("start_at_end"),
                hash_bookmark = x.getAttribute("hash_bookmark"),
                start_at_slide = x.getAttribute("start_at_slide"),
                start_zoom = x.getAttribute("start_zoom"),
                url = '//cdn.knightlab.com/libs/timeline/latest/embed/index.html?source=' + spreadsheet_id + '&font=' + font + '&maptype=' + map + '&lang=' + lang + '&start_at_end=' + start_at_end + '&hash_bookmark=' + hash_bookmark + '&start_at_slide=' + start_at_slide + '&start_zoom_adjust=' + start_zoom + '&height=' + height;

            return '<iframe title="' + frame_title + '" src="' + url + '" width="' + width + '" height="' + height + '" allowtransparency allowfullscreen></iframe>';
        });
    },
    "fallback": function () {
        let id = 'timelinejs';
        TarteAuCitron.fallback(['timelinejs-canvas'], function (elem) {
            elem.style.width = elem.getAttribute('width') + 'px';
            elem.style.height = elem.getAttribute('height') + 'px';
            return TarteAuCitron.engage(id);
        });
    }
};

// tagcommander
export let tagcommander = {
    "key": "tagcommander",
    "type": "api",
    "name": "TagCommander",
    "uri": "https://www.commandersact.com/en/privacy/",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        if (this.options.tagcommanderid === undefined) {
            return;
        }
        TarteAuCitron.addScript('https://cdn.tagcommander.com/' + this.options.tagcommanderid + '.js');
    }
};

// typekit
export let typekit = {
    "key": "typekit",
    "type": "api",
    "name": "Typekit (adobe)",
    "uri": "https://www.adobe.com/privacy.html",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        if (this.options.typekitId === undefined) {
            return;
        }
        TarteAuCitron.addScript('//use.typekit.net/' + this.options.typekitId + '.js', '', function () {
            try {
                Typekit.load();
            } catch (e) { }
        });
    }
};

// twenga
export let twenga = {
    "key": "twenga",
    "type": "ads",
    "name": "Twenga",
    "uri": "http://www.twenga.com/privacy.php",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {

        if (this.options.twengaId === undefined || this.options.twengaLocale === undefined) {
            return;
        }

        TarteAuCitron.addScript('//tracker.twenga.' + this.options.twengaLocale + '/st/tracker_' + this.options.twengaId + '.js');
    }
};

// twitter
export let twitter = {
    "key": "twitter",
    "type": "social",
    "name": "Twitter",
    "uri": "https://support.twitter.com/articles/20170514",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        TarteAuCitron.fallback(['tacTwitter'], '');
        TarteAuCitron.addScript('//platform.twitter.com/widgets.js', 'twitter-wjs');
    },
    "fallback": function () {
        let id = 'twitter';
        TarteAuCitron.fallback(['tacTwitter'], TarteAuCitron.engage(id));
    }
};

// twitter embed
export let twitterembed = {
    "key": "twitterembed",
    "type": "social",
    "name": "Twitter (cards)",
    "uri": "https://support.twitter.com/articles/20170514",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        let uniqIds = [],
            i,
            e,
            html;

        TarteAuCitron.fallback(['twitterembed-canvas'], function (x) {
            let uniqId = '_' + Math.random().toString(36).substr(2, 9);
            uniqIds.push(uniqId);
            html = '<div id="' + uniqId + '" ';
            html += 'tweetid="' + x.getAttribute('tweetid') + '" ';
            html += 'theme="' + x.getAttribute('theme') + '" ';
            html += 'cards="' + x.getAttribute('cards') + '" ';
            html += 'conversation="' + x.getAttribute('conversation') + '" ';
            html += 'data-width="' + x.getAttribute('data-width') + '" ';
            html += 'data-align="' + x.getAttribute('data-align') + '" ';
            html += '></div>';
            return html;
        });

        TarteAuCitron.addScript('//platform.twitter.com/widgets.js', 'twitter-wjs', function () {
            let i;
            for (i = 0; i < uniqIds.length; i += 1) {
                e = document.getElementById(uniqIds[i]);
                twttr.widgets.createTweet(
                    e.getAttribute('tweetid'),
                    e,
                    {
                        theme: e.getAttribute('theme'),
                        cards: e.getAttribute('cards'),
                        conversation: e.getAttribute('conversation'),
                        lang: TarteAuCitron.getLanguage(),
                        dnt: true,
                        width: e.getAttribute('data-width'),
                        align: e.getAttribute('data-align')
                    }
                );
            }
        });
    },
    "fallback": function () {
        let id = 'twitterembed';
        TarteAuCitron.fallback(['twitterembed-canvas'], function (elem) {
            elem.style.width = elem.getAttribute('data-width') + 'px';
            return TarteAuCitron.engage(id);
        });
    }
};

// twitter timeline
export let twittertimeline = {
    "key": "twittertimeline",
    "type": "social",
    "name": "Twitter (timelines)",
    "uri": "https://support.twitter.com/articles/20170514",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        TarteAuCitron.fallback(['tacTwitterTimelines'], '');
        TarteAuCitron.addScript('//platform.twitter.com/widgets.js', 'twitter-wjs');
    },
    "fallback": function () {
        let id = 'twittertimeline';
        TarteAuCitron.fallback(['tacTwitterTimelines'], TarteAuCitron.engage(id));
    }
};

// twitter universal website tag
export let twitteruwt = {
    "key": "twitteruwt",
    "type": "analytic",
    "name": "Twitter Universal Website Tag",
    "uri": "https://business.twitter.com/en/help/campaign-measurement-and-analytics/conversion-tracking-for-websites.html",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {

        window.twq = function () {
            window.twq.exe ? window.twq.exe.apply(window.twq, arguments) : window.twq.queue.push(arguments);
        }
        window.twq.version = '1.1';
        window.twq.queue = [];

        TarteAuCitron.addScript('https://static.ads-twitter.com/uwt.js', '', function () {
            window.twq('init', this.options.twitteruwtId);
            window.twq('track', 'PageView');
        });
    }
};

// user voice
export let uservoice = {
    "key": "uservoice",
    "type": "support",
    "name": "UserVoice",
    "uri": "https://www.uservoice.com/privacy/",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        if (this.options.userVoiceApi === undefined) {
            return;
        }
        TarteAuCitron.addScript('//widget.uservoice.com/' + this.options.userVoiceApi + '.js');
    }
};

// vimeo
export let vimeo = {
    "key": "vimeo",
    "type": "video",
    "name": "Vimeo",
    "uri": "https://vimeo.com/privacy",
    "needConsent": true,
    "options": {},
    "cookies": ['__utmt_player', '__utma', '__utmb', '__utmc', '__utmv', 'vuid', '__utmz', 'player'],
    "js": function () {
        TarteAuCitron.fallback(['vimeo_player'], function (x) {
            let frame_title = TarteAuCitron.fixSelfXSS(TarteAuCitron.getElemAttr(x, "data-title") || TarteAuCitron.getElemAttr(x, "title") || 'Vimeo iframe'),
                video_width = TarteAuCitron.getElemAttr(x, "data-width") || TarteAuCitron.getElemAttr(x, "width"),
                frame_width = 'width=',
                video_height = TarteAuCitron.getElemAttr(x, "data-height") || TarteAuCitron.getElemAttr(x, "height"),
                frame_height = 'height=',

                video_id = TarteAuCitron.getElemAttr(x, "data-videoID") || TarteAuCitron.getElemAttr(x, "videoID"),
                video_allowfullscreen = TarteAuCitron.getElemAttr(x, "data-allowfullscreen"),
                video_autopause = TarteAuCitron.getElemAttr(x, "data-autopause") || '',
                video_autoplay = TarteAuCitron.getElemAttr(x, "data-autoplay") || TarteAuCitron.getElemAttr(x, "autoplay") || '',
                video_background = TarteAuCitron.getElemAttr(x, "data-background") || '',
                video_byline = TarteAuCitron.getElemAttr(x, "data-byline") || TarteAuCitron.getElemAttr(x, "byline") || '',
                video_color = TarteAuCitron.getElemAttr(x, "data-color") || '',
                video_controls = TarteAuCitron.getElemAttr(x, "data-controls") || '',
                video_loop = TarteAuCitron.getElemAttr(x, "data-loop") || TarteAuCitron.getElemAttr(x, "loop") || '',
                video_maxheight = TarteAuCitron.getElemAttr(x, "data-maxheight") || '',
                video_maxwidth = TarteAuCitron.getElemAttr(x, "data-maxwidth") || '',
                video_muted = TarteAuCitron.getElemAttr(x, "data-muted") || '',
                video_playsinline = TarteAuCitron.getElemAttr(x, "data-playsinline") || '',
                video_portrait = TarteAuCitron.getElemAttr(x, "data-portrait") || TarteAuCitron.getElemAttr(x, "portrait") || '',
                video_speed = TarteAuCitron.getElemAttr(x, "data-speed") || '',
                video_title = TarteAuCitron.getElemAttr(x, "data-title") || TarteAuCitron.getElemAttr(x, "title") || '',
                video_transparent = TarteAuCitron.getElemAttr(x, "data-transparent") || '',

                video_frame;


            if (video_id === undefined) {
                return "";
            }
            if (video_width !== undefined) {
                frame_width += '"' + video_width + '" ';
            } else {
                frame_width += '"" ';
            }
            if (video_height !== undefined) {
                frame_height += '"' + video_height + '" ';
            } else {
                frame_height += '"" ';
            }

            let video_qs = "?";

            if (video_title.length > 0) {
                video_qs += "title=" + video_title;
            }

            if (video_byline.length > 0) {
                if (video_qs.length > 0) {
                    video_qs += "&";
                }
                video_qs += "byline=" + video_byline;
            }

            if (video_portrait.length > 0) {
                if (video_qs.length > 0) {
                    video_qs += "&";
                }
                video_qs += "portrait=" + video_portrait;
            }

            if (video_loop.length > 0) {
                if (video_qs.length > 0) {
                    video_qs += "&";
                }
                video_qs += "loop=" + video_loop;
            }

            if (video_autoplay.length > 0) {
                if (video_qs.length > 0) {
                    video_qs += "&";
                }
                video_qs += "autoplay=" + video_autoplay;
            }

            if (video_autopause.length > 0) {
                if (video_qs.length > 0) {
                    video_qs += "&";
                }
                video_qs += "autopause=" + video_autopause;
            }

            if (video_background.length > 0) {
                if (video_qs.length > 0) {
                    video_qs += "&";
                }
                video_qs += "background=" + video_background;
            }

            if (video_color.length > 0) {
                if (video_qs.length > 0) {
                    video_qs += "&";
                }
                video_qs += "color=" + video_color;
            }

            if (video_controls.length > 0) {
                if (video_qs.length > 0) {
                    video_qs += "&";
                }
                video_qs += "controls=" + video_controls;
            }

            if (video_maxheight.length > 0) {
                if (video_qs.length > 0) {
                    video_qs += "&";
                }
                video_qs += "maxheight=" + video_maxheight;
            }

            if (video_maxwidth.length > 0) {
                if (video_qs.length > 0) {
                    video_qs += "&";
                }
                video_qs += "maxwidth=" + video_maxwidth;
            }

            if (video_muted.length > 0) {
                if (video_qs.length > 0) {
                    video_qs += "&";
                }
                video_qs += "muted=" + video_muted;
            }

            if (video_playsinline.length > 0) {
                if (video_qs.length > 0) {
                    video_qs += "&";
                }
                video_qs += "playsinline=" + video_playsinline;
            }

            if (video_speed.length > 0) {
                if (video_qs.length > 0) {
                    video_qs += "&";
                }
                video_qs += "speed=" + video_speed;
            }

            if (video_transparent.length > 0) {
                if (video_qs.length > 0) {
                    video_qs += "&";
                }
                video_qs += "transparent=" + video_transparent;
            }

            if (video_qs === "?") {
                video_qs = "";
            }

            video_frame = '<iframe title="' + frame_title + '" src="//player.vimeo.com/video/' + video_id + video_qs + '" ' + frame_width + frame_height + (video_allowfullscreen === '0' ? '' : ' webkitallowfullscreen mozallowfullscreen allowfullscreen') + '></iframe>';

            return video_frame;
        });
    },
    "fallback": function () {
        let id = 'vimeo';
        TarteAuCitron.fallback(['vimeo_player'], function (elem) {
            elem.style.width = elem.getAttribute('width') + 'px';
            elem.style.height = elem.getAttribute('height') + 'px';
            return TarteAuCitron.engage(id);
        });
    }
};

// visualrevenue
export let visualrevenue = {
    "key": "visualrevenue",
    "type": "analytic",
    "name": "VisualRevenue",
    "uri": "http://www.outbrain.com/legal/privacy-713/",
    "needConsent": true,
    "options": {},
    "cookies": ['__vrf', '__vrm', '__vrl', '__vry', '__vru', '__vrid', '__vrz'],
    "js": function () {
        if (this.options.visualrevenueId === undefined) {
            return;
        }
        window._vrq = window._vrq || [];
        window._vrq.push(['id', this.options.visualrevenueId]);
        window._vrq.push(['automate', true]);
        window._vrq.push(['track', function () { }]);
        TarteAuCitron.addScript('http://a.visualrevenue.com/vrs.js');
    }
};

// verizon dot tag
export let verizondottag = {
    "key": "verizondottag",
    "type": "analytic",
    "name": "Verizon Dot Tag",
    "uri": "https://developer.verizonmedia.com/native/guide/audience-management/dottags/",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {

        window.dotq = window.dotq || [];
        window.dotq.push({
            'projectId': this.options.verizondottagProjectId,
            'properties': { 'pixelId': this.options.verizondottagPixelId }
        });

        TarteAuCitron.addScript('https://s.yimg.com/wi/ytc.js', '', function () {
            //const items = window.dotq;
            window.dotq = [];
            window.dotq.push = function (item) {
                YAHOO.ywa.I13N.fireBeacon([item])
            };
            YAHOO.ywa.I13N.fireBeacon(items)
        });
    }
};

// vshop
export let vshop = {
    "key": "vshop",
    "type": "ads",
    "name": "vShop",
    "uri": "http://vshop.fr/privacy-policy",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        TarteAuCitron.fallback(['vcashW'], '');
        TarteAuCitron.addScript('//vshop.fr/js/w.js');
    },
    "fallback": function () {
        let id = 'vshop';
        TarteAuCitron.fallback(['vcashW'], TarteAuCitron.engage(id));
    }
};

// wysistat
export let wysistat = {
    "key": "wysistat",
    "type": "analytic",
    "name": "Wysistat",
    "uri": "http://wysistat.net/contact/",
    "needConsent": true,
    "options": {},
    "cookies": ['Wysistat'],
    "js": function () {
        if (this.options.wysistat === undefined) {
            return;
        }
        TarteAuCitron.addScript('//www.wysistat.com/statistique.js', '', function () {
            window.stat(this.options.wysistat.cli, this.options.wysistat.frm, this.options.wysistat.prm, this.options.wysistat.ce, this.options.wysistat.page, this.options.wysistat.roi, this.options.wysistat.prof, this.options.wysistat.cpt);
        });
    }
};

// xiti
export let xiti = {
    "key": "xiti",
    "type": "analytic",
    "name": "Xiti",
    "uri": "https://helpcentre.atinternet-solutions.com/hc/fr/categories/360002439300-Privacy-Centre",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        if (this.options.xitiId === undefined) {
            return;
        }
        let Xt_param = 's=' + this.options.xitiId + '&p=',
            Xt_r,
            Xt_h,
            Xt_i,
            Xt_s,
            div = document.createElement('div');
        try {
            Xt_r = top.document.referrer;
        } catch (e) {
            Xt_r = document.referrer;
        }
        Xt_h = new Date();
        Xt_i = '<img style="display:none" border="0" alt="" ';
        Xt_i += 'src="http://logv3.xiti.com/hit.xiti?' + Xt_param;
        Xt_i += '&hl=' + Xt_h.getHours() + 'x' + Xt_h.getMinutes() + 'x' + Xt_h.getSeconds();
        if (parseFloat(navigator.appVersion) >= 4) {
            Xt_s = screen;
            Xt_i += '&r=' + Xt_s.width + 'x' + Xt_s.height + 'x' + Xt_s.pixelDepth + 'x' + Xt_s.colorDepth;
        }

        div.innerHTML = Xt_i + '&ref=' + Xt_r.replace(/[<>"]/g, '').replace(/&/g, '$') + '" title="Internet Audience">';
        document.getElementsByTagName('body')[0].appendChild(div.firstChild);

        if (typeof this.options.xitiMore === 'function') {
            this.options.xitiMore();
        }
    }
};

// AT Internet
export let atinternet = {
    "key": "atinternet",
    "type": "analytic",
    "name": "AT Internet (privacy by design)",
    "uri": "https://helpcentre.atinternet-solutions.com/hc/fr/categories/360002439300-Privacy-Centre",
    "needConsent": true,
    "safeanalytic": false,
    "options": {},
    "cookies": ['atidvisitor', 'atreman', 'atredir', 'atsession'],
    "js": function () {
        if (this.options.atLibUrl === undefined) {
            return;
        }

        if (this.options.atinternetAlreadyLoaded !== undefined) {
            return;
        }

        TarteAuCitron.addScript(this.options.atLibUrl, '', function () {

            window.tag = new ATInternet.Tracker.Tag();

            if (typeof this.options.atMore === 'function') {
                this.options.atMore();
            }

            if (typeof window.tag.privacy !== 'undefined') {
                window.tag.privacy.setVisitorOptin();
            }

            if (this.options.atinternetSendData !== false) {
                window.tag.page.send();
            }
        });
    },
    "fallback": function () {
        if (this.options.atLibUrl === undefined) {
            return;
        }

        this.options.atinternetAlreadyLoaded = true;

        TarteAuCitron.addScript(this.options.atLibUrl, '', function () {

            window.tag = new ATInternet.Tracker.Tag();

            if (typeof this.options.atMore === 'function') {
                this.options.atMore();
            }

            if (typeof window.tag.privacy !== 'undefined') {

                let visitorMode = window.tag.privacy.getVisitorMode();
                if (visitorMode !== null && visitorMode.name !== undefined && visitorMode.name === "optout") {
                    window.tag.privacy.setVisitorOptout();
                } else {
                    window.tag.privacy.setVisitorMode('cnil', 'exempt');
                }
            }

            if (this.options.atinternetSendData !== false) {
                window.tag.page.send();
            }
        });
    }
};

// AT Internet
export let atinternethightrack = {
    "key": "atinternethightrack",
    "type": "analytic",
    "name": "AT Internet",
    "uri": "https://helpcentre.atinternet-solutions.com/hc/fr/categories/360002439300-Privacy-Centre",
    "needConsent": true,
    "options": {},
    "cookies": ['atidvisitor', 'atreman', 'atredir', 'atsession'],
    "js": function () {
        if (this.options.atLibUrl === undefined) {
            return;
        }

        TarteAuCitron.addScript(this.options.atLibUrl, '', function () {

            let tag = new ATInternet.Tracker.Tag();

            if (typeof this.options.atMore === 'function') {
                this.options.atMore();
            }
        })
    }
};

// youtube
export let youtube = {
    "key": "youtube",
    "type": "video",
    "name": "YouTube",
    "uri": "https://policies.google.com/privacy",
    "needConsent": true,
    "options": {},
    "cookies": ['VISITOR_INFO1_LIVE', 'YSC', 'PREF', 'GEUP'],
    "js": function () {
        TarteAuCitron.fallback(['youtube_player'], function (x) {
            console.log('fallback for youtube js', x);
            let iframe = document.createElement('iframe');
            let frame_title = TarteAuCitron.fixSelfXSS(TarteAuCitron.getElemAttr(x, "title") || 'Youtube iframe'),
                video_id = TarteAuCitron.getElemAttr(x, "videoID"),
                srcdoc = TarteAuCitron.getElemAttr(x, "srcdoc"),
                loading = TarteAuCitron.getElemAttr(x, "loading"),
                video_width = TarteAuCitron.getElemAttr(x, "width"),
                frame_width = 'width=',
                video_height = TarteAuCitron.getElemAttr(x, "height"),
                frame_height = 'height=',
                video_frame,
                allowfullscreen = TarteAuCitron.getElemAttr(x, "allowfullscreen"),
                attrs = ["theme", "rel", "controls", "showinfo", "autoplay", "mute", "start", "loop"],
                params = attrs.filter(function (a) {

                    return TarteAuCitron.getElemAttr(x, a) !== null;
                }).map(function (a) {
                    return a + "=" + TarteAuCitron.getElemAttr(x, a);
                }).join("&");

            console.log(params);

            if(TarteAuCitron.getElemAttr(x, "loop") === 1) {
                params = params + "&playlist=" + video_id;
            }

            if (video_id === undefined) {
                return document.createElement('div');
            }
            if (video_width !== undefined) {
                frame_width += '"' + video_width + '" ';
            } else {
                frame_width += '"" ';
            }
            if (video_height !== undefined) {
                frame_height += '"' + video_height + '" ';
            } else {
                frame_height += '"" ';
            }

            if (srcdoc !== undefined && srcdoc !== null && srcdoc !== "") {
                srcdoc = 'srcdoc="' + srcdoc + '" ';
            } else {
                srcdoc = '';
            }

            if (loading !== undefined && loading !== null && loading !== "") {
                loading = 'loading ';
            } else {
                loading = '';
            }


            iframe.setAttribute('title', frame_title);
            iframe.setAttribute('width', video_width);
            iframe.setAttribute('height', video_height);
            iframe.setAttribute('src', '//www.youtube-nocookie.com/embed/' + video_id + '?' + params + '"' + (allowfullscreen === '0' ? '' : ' webkitallowfullscreen mozallowfullscreen allowfullscreen') + ' ' + srcdoc + ' ' + loading);

            return iframe;
        });
    },
    "fallback": function (engageDiv) {
        let id = 'youtube';

        TarteAuCitron.fallback(['youtube_player'], function (elem) {
            elem.style.width = elem.getAttribute('width') + 'px';
            elem.style.height = elem.getAttribute('height') + 'px';

            return engageDiv;
        });
    }
};

// youtube playlist
export let youtubeplaylist = {
    "key": "youtubeplaylist",
    "type": "video",
    "name": "YouTube (playlist)",
    "uri": "https://policies.google.com/privacy",
    "needConsent": true,
    "options": {},
    "cookies": ['VISITOR_INFO1_LIVE', 'YSC', 'PREF', 'GEUP'],
    "js": function () {
        TarteAuCitron.fallback(['youtube_playlist_player'], function (x) {
            let frame_title = TarteAuCitron.fixSelfXSS(TarteAuCitron.getElemAttr(x, "title") || 'Youtube iframe'),
                playlist_id = TarteAuCitron.getElemAttr(x, "playlistID"),
                video_width = TarteAuCitron.getElemAttr(x, "width"),
                frame_width = 'width=',
                video_height = TarteAuCitron.getElemAttr(x, "height"),
                frame_height = 'height=',
                video_frame,
                allowfullscreen = TarteAuCitron.getElemAttr(x, "allowfullscreen"),
                params = 'theme=' + TarteAuCitron.getElemAttr(x, "theme") + '&rel=' + TarteAuCitron.getElemAttr(x, "rel") + '&controls=' + TarteAuCitron.getElemAttr(x, "controls") + '&showinfo=' + TarteAuCitron.getElemAttr(x, "showinfo") + '&autoplay=' + TarteAuCitron.getElemAttr(x, "autoplay") + '&mute=' + TarteAuCitron.getElemAttr(x, "mute");

            if (playlist_id === undefined) {
                return "";
            }
            if (video_width !== undefined) {
                frame_width += '"' + video_width + '" ';
            } else {
                frame_width += '"" ';
            }
            if (video_height !== undefined) {
                frame_height += '"' + video_height + '" ';
            } else {
                frame_height += '"" ';
            }
            video_frame = '<iframe title="' + frame_title + '" type="text/html" ' + frame_width + frame_height + ' src="//www.youtube-nocookie.com/embed/videoseries?list=' + playlist_id + '&' + params + '"' + (allowfullscreen === '0' ? '' : ' webkitallowfullscreen mozallowfullscreen allowfullscreen') + '></iframe>';
            return video_frame;
        });
    },
    "fallback": function () {
        let id = 'youtubeplaylist';
        TarteAuCitron.fallback(['youtube_playlist_player'], function (elem) {
            elem.style.width = elem.getAttribute('width') + 'px';
            elem.style.height = elem.getAttribute('height') + 'px';
            return TarteAuCitron.engage(id);
        });
    }
};

// zopim
export let zopim = {
    "key": "zopim",
    "type": "support",
    "name": "Zopim",
    "uri": "https://www.zopim.com/privacy",
    "needConsent": true,
    "options": {},
    "cookies": ['__zlcid', '__zprivacy'],
    "js": function () {
        if (this.options.zopimID === undefined) {
            return;
        }
        TarteAuCitron.addScript('//v2.zopim.com/?' + this.options.zopimID);
    }
};

// kameleoon
export let kameleoon = {
    "key": "kameleoon",
    "type": "analytic",
    "name": "Kameleoon",
    "uri": "https://www.kameleoon.com/fr/compliance/rgpd",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        if (this.options.kameleoon !== undefined) {
            TarteAuCitron.addScript("https://" + this.options.kameleoon + ".kameleoon.eu/kameleoon.js");
        }
    }
};

// linkedin insight
export let linkedininsighttag = {
    "key": "linkedininsighttag",
    "type": "ads",
    "name": "Linkedin Insight",
    "uri": "https://www.linkedin.com/legal/cookie_policy",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        if (this.options.linkedininsighttag !== undefined) {
            window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
            window._linkedin_data_partner_ids.push(this.options.linkedininsighttag);
        }

        TarteAuCitron.addScript('https://snap.licdn.com/li.lms-analytics/insight.min.js');
    }
};

// xiti smartTag
export let xiti_smarttag = {
    "key": "xiti_smarttag",
    "type": "analytic",
    "name": "Xiti (SmartTag)",
    "uri": "https://helpcentre.atinternet-solutions.com/hc/fr/categories/360002439300-Privacy-Centre",
    "needConsent": true,
    "options": {},
    "cookies": ["atidvisitor", "atreman", "atredir", "atsession", "attvtreman", "attvtsession"],
    "js": function () {
        if (this.options.xiti_smarttagLocalPath !== undefined) {
            TarteAuCitron.addScript(this.options.xiti_smarttagLocalPath, 'smarttag', null, null, "onload", "addTracker();");
        } else {
            let xitiSmarttagId = this.options.xiti_smarttagSiteId;
            if (xitiSmarttagId === undefined) {
                return;
            }

            TarteAuCitron.addScript('//tag.aticdn.net/' + xitiSmarttagId + '/smarttag.js', 'smarttag', null, null, "onload", "addTracker();");
        }
    }
};

// facebook pixel
export let facebookpixel = {
    "key": "facebookpixel",
    "type": "ads",
    "name": "Facebook Pixel",
    "uri": "https://www.facebook.com/policy.php",
    "needConsent": true,
    "options": {},
    "cookies": ['datr', 'fr', 'reg_ext_ref', 'reg_fb_gate', 'reg_fb_ref', 'sb', 'wd', 'x-src', '_fbq'],
    "js": function () {
        let n;
        if (window.fbq) return;
        n = window.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) };
        if (!window._fbq) window._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        TarteAuCitron.addScript('https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', this.options.facebookpixelId);
        fbq('track', 'PageView');

        if (typeof this.options.facebookpixelMore === 'function') {
            this.options.facebookpixelMore();
        }
    }
};

//Issuu
export let issuu = {
    "key": "issuu",
    "type": "other",
    "name": "Issuu",
    "uri": "https://issuu.com/legal/privacy",
    "needConsent": true,
    "options": {},
    "cookies": ['__qca', 'iutk', 'mc'],
    "js": function () {
        TarteAuCitron.fallback(['issuu_player'], function (x) {
            let frame_title = TarteAuCitron.fixSelfXSS(x.getAttribute("title") || 'Issuu iframe'),
                issuu_id = x.getAttribute("issuuID"),
                issuu_width = x.getAttribute("width"),
                frame_width = 'width=',
                issuu_height = x.getAttribute("height"),
                frame_height = 'height=',
                issuu_frame,
                issuu_embed;

            if (issuu_id === undefined) {
                return "";
            }
            if (issuu_width !== undefined) {
                frame_width += '"' + issuu_width + '" ';
            } else {
                frame_width += '"" ';
            }
            if (issuu_height !== undefined) {
                frame_height += '"' + issuu_height + '" ';
            } else {
                frame_height += '"" ';
            }


            if (issuu_id.match(/\d+\/\d+/)) { issuu_embed = '#' + issuu_id; } else if (issuu_id.match(/d=(.*)&u=(.*)/)) { issuu_embed = '?' + issuu_id; }


            issuu_frame = '<iframe title="' + frame_title + '" type="text/html" ' + frame_width + frame_height + ' src="//e.issuu.com/embed.html' + issuu_embed + '"></iframe>';

            return issuu_frame;
        });
    },
    "fallback": function () {
        let id = 'issuu';
        TarteAuCitron.fallback(['issuu_player'], function (elem) {
            elem.style.width = elem.getAttribute('width') + 'px';
            elem.style.height = elem.getAttribute('height') + 'px';
            return TarteAuCitron.engage(id);
        });
    }
};

// webmecanik
export let webmecanik = {
    "key": "webmecanik",
    "type": "analytic",
    "name": "Webmecanik",
    "uri": "https://webmecanik.com/tos",
    "needConsent": true,
    "options": {},
    "cookies": ['mtc_id', 'mtc_sid'],
    "js": function () {
        if (this.options.webmecanikurl === undefined) {
            return;
        }

        window.MauticTrackingObject = 'mt';
        window.mt = window.mt || function () {
            window.mt.q = window.mt.q || [];
            window.mt.q.push(arguments);
        };

        TarteAuCitron.addScript(this.options.webmecanikurl, '', function () {
            mt('send', 'pageview');
        });
    }
};

// google analytics multiple
export let multiplegtag = {
    "key": "multiplegtag",
    "type": "analytic",
    "name": "Google Analytics (gtag.js)",
    "uri": "https://support.google.com/analytics/answer/6004245",
    "needConsent": true,
    "options": {},
    "cookies": function () {
        let cookies = ['_ga', '_gat', '_gid', '__utma', '__utmb', '__utmc', '__utmt', '__utmz'];

        if (this.options.multiplegtagUa !== undefined) {
            this.options.multiplegtagUa.forEach(function (ua) {
                cookies.push('_gat_gtag_' + ua.replace(/-/g, '_'));
                cookies.push('_ga_' + ua.replace(/G-/g, ''));
            });
        }

        return cookies;
    },
    "js": function () {
        window.dataLayer = window.dataLayer || [];

        if (this.options.multiplegtagUa !== undefined) {
            this.options.multiplegtagUa.forEach(function (ua) {
                TarteAuCitron.addScript('https://www.googletagmanager.com/gtag/js?id=' + ua, '', function () {
                    window.gtag = function gtag() { dataLayer.push(arguments); }
                    gtag('js', new Date());
                    gtag('config', ua, { 'anonymize_ip': true });
                });
            });
        }
    }
};

// Koban
export let koban = {
    "key": "koban",
    "type": "analytic",
    "name": "Koban",
    "uri": "https://koban.cloud/tos",
    "needConsent": true,
    "options": {},
    "cookies": ['kbntrk'],
    "js": function () {
        if (this.options.kobanurl === undefined) {
            return;
        }
        if (this.options.kobanapi === undefined) {
            return;
        }
        window.KobanObject = 'kb';
        window.kb = window.kb || function () {
            window.kb.q = window.kb.q || [];
            window.kb.q.push(arguments);
        };
        window.kb.l = new Date();
        kb('reg', this.options.kobanapi);
        TarteAuCitron.addScript(this.options.kobanurl, '', function () {
        });
    }
};

// matomo

/*
    1. Set the following variable before the initialization :

    this.options.matomoId = YOUR_SITE_ID_FROM_MATOMO;
    this.options.matomoHost = "YOUR_MATOMO_URL"; //eg: https://stat.mydomain.com/

    2. Push the service :

    (TarteAuCitron.job = TarteAuCitron.job || []).push('matomo');

    3. HTML
    You don't need to add any html code, if the service is autorized, the javascript is added. otherwise no.
 */
export let matomo = {
    "key": "matomo",
    "type": "analytic",
    "name": "Matomo (privacy by design)",
    "uri": "https://matomo.org/faq/general/faq_146/",
    "needConsent": false,
    "options": {},
    "cookies": ['_pk_ref', '_pk_cvar', '_pk_id', '_pk_ses', '_pk_hsr', 'piwik_ignore', '_pk_uid'],
    "js": function () {
        if (this.options.matomoId === undefined) {
            return;
        }

        window._paq = window._paq || [];
        window._paq.push(["setSiteId", this.options.matomoId]);
        window._paq.push(["setTrackerUrl", this.options.matomoHost + "piwik.php"]);
        window._paq.push(["setDoNotTrack", 1]);
        window._paq.push(["trackPageView"]);
        window._paq.push(["setIgnoreClasses", ["no-tracking", "colorbox"]]);
        window._paq.push(["enableLinkTracking"]);
        window._paq.push([function () {
            let self = this;
            function getOriginalVisitorCookieTimeout() {
                let now = new Date(),
                    nowTs = Math.round(now.getTime() / 1000),
                    visitorInfo = self.getVisitorInfo();
                let createTs = parseInt(visitorInfo[2]);
                let cookieTimeout = 33696000; // 13 mois en secondes
                let originalTimeout = createTs + cookieTimeout - nowTs;
                return originalTimeout;
            }
            this.setVisitorCookieTimeout(getOriginalVisitorCookieTimeout());
        }]);

        TarteAuCitron.addScript(this.options.matomoHost + 'piwik.js', '', '', true, 'defer', true);

        // waiting for piwik to be ready to check first party cookies
        let interval = setInterval(function () {
            if (typeof Piwik === 'undefined') return

            clearInterval(interval)

            // make piwik/matomo cookie accessible by getting tracker
            Piwik.getTracker();

            // looping throught cookies
            let theCookies = document.cookie.split(';');
            for (let i = 1; i <= theCookies.length; i++) {
                let cookie = theCookies[i - 1].split('=');
                let cookieName = cookie[0].trim();

                // if cookie starts like a piwik one, register it
                if (cookieName.indexOf('_pk_') === 0) {
                    this.cookies.push(cookieName);
                }
            }
        }, 100)
    }
};


export let matomohightrack = {
    "key": "matomohightrack",
    "type": "analytic",
    "name": "Matomo",
    "uri": "https://matomo.org/faq/general/faq_146/",
    "needConsent": false,
    "options": {},
    "cookies": ['_pk_ref', '_pk_cvar', '_pk_id', '_pk_ses', '_pk_hsr', 'piwik_ignore', '_pk_uid'],
    "js": function () {
        if (this.options.matomoId === undefined) {
            return;
        }

        window._paq = window._paq || [];
        window._paq.push(["setSiteId", this.options.matomoId]);
        window._paq.push(["setTrackerUrl", this.options.matomoHost + "piwik.php"]);
        window._paq.push(["trackPageView"]);
        window._paq.push(["setIgnoreClasses", ["no-tracking", "colorbox"]]);
        window._paq.push(["enableLinkTracking"]);
        window._paq.push([function () {
            let self = this;
        }]);

        TarteAuCitron.addScript(this.options.matomoHost + 'piwik.js', '', '', true, 'defer', true);

        // waiting for piwik to be ready to check first party cookies
        let interval = setInterval(function () {
            if (typeof Piwik === 'undefined') return

            clearInterval(interval)
            Piwik.getTracker();

            let theCookies = document.cookie.split(';');
            for (let i = 1; i <= theCookies.length; i++) {
                let cookie = theCookies[i - 1].split('=');
                let cookieName = cookie[0].trim();

                if (cookieName.indexOf('_pk_') === 0) {
                    this.cookies.push(cookieName);
                }
            }
        }, 100)
    }
};

// Hotjar
/*
   1. Set the following variable before the initialization :
    this.options.hotjarId = YOUR_WEBSITE_ID;
   this.options.HotjarSv = XXXX; // Can be found in your website tracking code as "hjvs=XXXX"
    2. Push the service :
    (TarteAuCitron.job = TarteAuCitron.job || []).push('hotjar');
    3. HTML
   You don't need to add any html code, if the service is autorized, the javascript is added. otherwise no.
 */
export let hotjar = {
    "key": "hotjar",
    "type": "analytic",
    "name": "Hotjar",
    "uri": "https://help.hotjar.com/hc/en-us/categories/115001323967-About-Hotjar",
    "needConsent": true,
    "options": {},
    "cookies": ["hjClosedSurveyInvites", "_hjDonePolls", "_hjMinimizedPolls", "_hjDoneTestersWidgets", "_hjMinimizedTestersWidgets", "_hjDoneSurveys", "_hjIncludedInSample", "_hjShownFeedbackMessage", "_hjAbsoluteSessionInProgress", "_hjIncludeInPageviewSample", "_hjid"],
    "js": function () {
        if (this.options.hotjarId === undefined || this.options.HotjarSv === undefined) {
            return;
        }
        window.hj = window.hj || function () {
            (window.hj.q = window.hj.q || []).push(arguments)
        };
        window._hjSettings = {
            hjid: this.options.hotjarId,
            hjsv: this.options.HotjarSv
        };
        let uri = 'https://static.hotjar.com/c/hotjar-';
        let extension = '.js?sv=';
        TarteAuCitron.addScript(uri + window._hjSettings.hjid + extension + window._hjSettings.hjsv);
    }
};

// bing ads universal event tracking
export let bingads = {
    'key': 'bingads',
    'type': 'ads',
    'name': 'Bing Ads Universal Event Tracking',
    'uri': 'https://advertise.bingads.microsoft.com/en-us/resources/policies/personalized-ads',
    'needConsent': true,
    'cookies': ['_uetmsclkid', '_uetvid', '_uetsid'],
    'js': function () {
        'use strict';
        //let u = this.options.bingadsTag || 'uetq';
        window.uetq = window.uetq || [];

        TarteAuCitron.addScript('https://bat.bing.com/bat.js', '', function () {
            let bingadsCreate = { ti: this.options.bingadsID };

            if ('bingadsStoreCookies' in this.options) {
                bingadsCreate['storeConvTrackCookies'] = this.options.bingadsStoreCookies;
            }

            bingadsCreate.q = window.uetq;
            window.uetq = new UET(bingadsCreate);
            window.uetq.push('pageLoad');

            if (typeof this.options.bingadsMore === 'function') {
                this.options.bingadsMore();
            }
        });
    }
};

//Matterport
export let matterport = {
    "key": "matterport",
    "type": "other",
    "name": "Matterport",
    "uri": "https://matterport.com/es/legal/privacy-policy/",
    "needConsent": true,
    "options": {},
    "cookies": ['__cfduid', 'ajs_anonymous_id', 'ajs_group_id', 'ajs_user_id'],
    "js": function () {
        TarteAuCitron.fallback(['matterport'], function (x) {
            let frame_title = TarteAuCitron.fixSelfXSS(x.getAttribute("title") || 'Matterport iframe'),
                matterport_id = x.getAttribute("matterportID"),
                matterport_width = x.getAttribute("width"),
                frame_width = 'width=',
                matterport_height = x.getAttribute("height"),
                frame_height = 'height=',
                matterport_parameters = x.getAttribute("parameters"),
                matterport_allowfullscreen = x.getAttribute('allowfullscreen'),
                matterport_frame;

            if (matterport_id === undefined) {
                return "";
            }
            if (matterport_width !== undefined) {
                frame_width += '"' + matterport_width + '" ';
            } else {
                frame_width += '"" ';
            }
            if (matterport_height !== undefined) {
                frame_height += '"' + matterport_height + '" ';
            } else {
                frame_height += '"" ';
            }
            if (matterport_parameters === undefined) {
                return "";
            }

            matterport_frame = '<iframe title="' + frame_title + '" type="text/html" ' + frame_width + frame_height + ' src="https://my.matterport.com/show/?m=' + matterport_id + '&utm_source=hit-content' + matterport_parameters + '"' + (matterport_allowfullscreen === '0' ? '' : ' webkitallowfullscreen mozallowfullscreen allowfullscreen') + '></iframe>';
            return matterport_frame;
        });
    },
    "fallback": function () {
        let id = 'matterport';
        TarteAuCitron.fallback(['matterport'], function (elem) {
            elem.style.width = elem.getAttribute('width') + 'px';
            elem.style.height = elem.getAttribute('height') + 'px';
            return TarteAuCitron.engage(id);
        });
    }
};

// Adform
export let adform = {
    "key": "adform",
    "type": "ads",
    "name": "Adform",
    "uri": "https://site.adform.com/privacy-center/overview/",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {

        if (this.options.adformpm === undefined || this.options.adformpagename === undefined) {
            return;
        }

        window._adftrack = {
            pm: this.options.adformpm,
            divider: encodeURIComponent('|'),
            pagename: encodeURIComponent(this.options.adformpagename)
        };

        TarteAuCitron.addScript("https://track.adform.net/serving/scripts/trackpoint/async/");
    }
};

// Active Campaign
export let activecampaign = {
    "key": "activecampaign",
    "type": "ads",
    "name": "Active Campaign",
    "uri": "https://www.activecampaign.com/privacy-policy/",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        if (this.options.actid === undefined) {
            return;
        }

        window.trackcmp_email = '';

        TarteAuCitron.addScript('https://trackcmp.net/visit?actid=' + this.options.actid + '&e=' + encodeURIComponent(trackcmp_email) + '&r=' + encodeURIComponent(document.referrer) + '&u=' + encodeURIComponent(window.location.href));
    }
};

// tawk.to
export let tawkto = {
    "key": "tawkto",
    "type": "support",
    "name": "Tawk.to chat",
    "uri": "https://www.tawk.to/data-protection/",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        if (this.options.tawktoId === undefined) {
            return;
        }

        window.Tawk_API = window.Tawk_API || {};
        window.Tawk_LoadStart = new Date();

        TarteAuCitron.addScript('https://embed.tawk.to/' + this.options.tawktoId + '/default');
    }

};

// getquanty
export let getquanty = {
    "key": "getquanty",
    "type": "analytic",
    "name": "GetQuanty",
    "uri": "https://www.getquanty.com/mentions-legales/",
    "needConsent": true,
    "options": {},
    "cookies": ['_first_pageview', 'eqy_sessionid', 'eqy_siteid', 'cluid', 'eqy_company', 'cluid', 'gq_utm', '_jsuid'],
    "js": function () {
        if (this.options.getguanty === undefined) {
            return;
        }

        if (this.options.getquantyAlreadyLoaded !== undefined) {
            return;
        }

        TarteAuCitron.addScript('https://get.smart-data-systems.com/gq?site_id=' + this.options.getguanty + '&consent=1');
    },
    "fallback": function () {
        if (this.options.getguanty === undefined) {
            return;
        }

        this.options.getquantyAlreadyLoaded = true;

        TarteAuCitron.addScript('https://get.smart-data-systems.com/gq?site_id=' + this.options.getguanty + '&notrack=1');
    }
};

// emolytics
export let emolytics = {
    "key": "emolytics",
    "type": "analytic",
    "name": "Emolytics",
    "uri": "https://www.emolytics.com/main/privacy-policy.php",
    "needConsent": true,
    "options": {},
    "cookies": ['__hssc', '__hssrc', '__hstc', '_ga', '_gid', 'hubspotutk', 'lang', 'incap_ses_', 'nlbi_', 'visid_incap_'],
    "js": function () {
        if (this.options.emolyticsID === undefined) {
            return;
        }
        let scriptEmolytics = document.createElement('script');
        scriptEmolytics.text = 'let getsmily_id="' + this.options.emolyticsID + '";';
        document.getElementsByTagName('body')[0].appendChild(scriptEmolytics);
        TarteAuCitron.addScript('https://cdn.emolytics.com/script/emolytics-widget.js')
    }
};

// youtubeapi
export let youtubeapi = {
    "key": "youtubeapi",
    "type": "video",
    "name": "Youtube (Js API)",
    "uri": "https://policies.google.com/privacy",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        TarteAuCitron.addScript('https://www.youtube.com/player_api');
    }
};

// Facil'ITI
export let faciliti = {
    "key": "faciliti",
    "type": "other",
    "name": "Facil'ITI",
    "uri": "https://ws.facil-iti.com/mentions-legales.html",
    "needConsent": true,
    "options": {},
    "cookies": ['FACIL_ITI_LS'],
    "js": function () {
        if (this.options.facilitiID === undefined) {
            return;
        }

        (function (w, d, s, f) {
            w[f] = w[f] || { conf: function () { (w[f].data = w[f].data || []).push(arguments); } };
            let l = d.createElement(s), e = d.getElementsByTagName(s)[0];
            l.async = 1; l.src = 'https://ws.facil-iti.com/tag/faciliti-tag.min.js'; e.parentNode.insertBefore(l, e);
        }(window, document, 'script', 'FACIL_ITI'));
        FACIL_ITI.conf('userId', this.options.facilitiID);
    }
};

// userlike
export let userlike = {
    "key": "userlike",
    "type": "support",
    "name": "Userlike",
    "uri": "https://www.userlike.com/en/terms#privacy-policy",
    "needConsent": true,
    "options": {},
    "cookies": ['uslk_s', 'uslk_e'],
    "js": function () {
        if (this.options.userlikeKey === undefined) {
            return;
        }
        TarteAuCitron.addScript('//userlike-cdn-widgets.s3-eu-west-1.amazonaws.com/' + this.options.userlikeKey);
    }
};

// adobeanalytics
export let adobeanalytics = {
    "key": "adobeanalytics",
    "type": "analytic",
    "name": "Adobe Analytics",
    "uri": "https://www.adobe.com/privacy/policy.html",
    "needConsent": true,
    "options": {},
    "cookies": ['s_ecid', 's_cc', 's_sq', 's_vi', 's_fid'],
    "js": function () {
        if (this.options.adobeanalyticskey === undefined) {
            return;
        }
        TarteAuCitron.addScript('//assets.adobedtm.com/launch-' + this.options.adobeanalyticskey + '.min.js');
    }
};

// woopra customer journey analytics
export let woopra = {
    'key': 'woopra',
    'type': 'analytic',
    'name': 'Woopra Customer Journey Analytics',
    'uri': 'https://www.woopra.com/privacy',
    'needConsent': true,
    'cookies': ['wooTracker', 'intercom-session-erbfalba', 'intercom-id-erbfalba'],
    'js': function () {
        'use strict';
        //let w = this.options.woopraDomain;
        //window[w] = window[w] || [];

        (function () {
            let t, i, e, n = window, o = document, a = arguments, s = "script", r = ["config", "track", "identify", "visit", "push", "call", "trackForm", "trackClick"], c = function () { let t, i = this; for (i._e = [], t = 0; r.length > t; t++)(function (t) { i[t] = function () { return i._e.push([t].concat(Array.prototype.slice.call(arguments, 0))), i } })(r[t]) }; for (n._w = n._w || {}, t = 0; a.length > t; t++)n._w[a[t]] = n[a[t]] = n[a[t]] || new c; i = o.createElement(s), i.async = 1, i.src = "//static.woopra.com/js/w.js", e = o.getElementsByTagName(s)[0], e.parentNode.insertBefore(i, e)
        })("woopra");

        woopra.config({
            domain: this.options.woopraDomain
        });
        woopra.track();
    }
};

// ausha
export let ausha = {
    key: "ausha",
    type: "video",
    name: "Ausha",
    uri: "https://www.ausha.co/protection-personal-data/",
    needConsent: true,
    cookies: [],
    js: function () {
        TarteAuCitron.fallback(['ausha_player'], function (x) {
            let player_height = x.getAttribute('data-height'),
                podcast_id = x.getAttribute('data-podcast-id'),
                player_id = x.getAttribute('data-player-id'),
                playlist = x.getAttribute('data-playlist'),
                color = x.getAttribute('data-color');

            if (podcast_id === undefined) {
                return "";
            }

            let src = 'https://player.ausha.co/index.html?podcastId=' + podcast_id + '&v=3';

            if (playlist && playlist.length > 0) src += '&playlist=' + playlist;
            if (color && color.length > 0) src += '&color=' + color.replace('#', '%23');
            if (player_id && player_id.length > 0) src += '&playerId=' + player_id;

            return '<iframe id="' + player_id + '" loading="lazy" width="100%" height="' + player_height + '" scrolling="no" frameborder="no" src="' + src + '"></iframe>';
        });

        TarteAuCitron.addScript('//player.ausha.co/ausha-player.js', 'ausha-player');
    },
    fallback: function () {
        TarteAuCitron.fallback(['ausha_player'], function (elem) {
            elem.style.height = elem.getAttribute('data-height') + 'px';
            return TarteAuCitron.engage('ausha');
        });
    }
};

// visiblee
export let visiblee = {
    key: "visiblee",
    type: "analytic",
    name: "Visiblee",
    uri: "http://confidentiality.visiblee.io/fr/confidentialite",
    needConsent: true,
    cookies: [], //["visitor_v2", this.options.visibleedomain, "check", "campaign_ref_" + this.options.visibleedomain, "reload_" + this.options.visibleedomain],
    js: function () {

        if (this.options.visibleeclientid === undefined) {
            return;
        }
        TarteAuCitron.addScript('//www.link-page.info/tracking_' + this.options.visibleeclientid + '.js', 'visiblee');
    }
};

// bandcamp
export let bandcamp = {
    key: "bandcamp",
    type: "video",
    name: "Bandcamp",
    uri: "https://bandcamp.com",
    readmoreLink: "https://bandcamp.com/privacy",
    needConsent: true,
    cookies: ['client_id', 'BACKENDID', '_comm_playlist'],
    js: function () {
        TarteAuCitron.fallback(['bandcamp_player'], function (x) {
            let frame_title = TarteAuCitron.fixSelfXSS(x.getAttribute("title") || 'Bandcamp iframe'),
                album_id = x.getAttribute("albumID"),
                bandcamp_width = x.getAttribute("width"),
                frame_width = 'width=',
                bandcamp_height = x.getAttribute("height"),
                frame_height = 'height=',
                attrs = ["size", "bgcol", "linkcol", "artwork", "minimal", "tracklist", "package", "transparent"],
                params = attrs.filter(function (a) {
                    return x.getAttribute(a) !== null;
                }).map(function (a) {
                    if (a && a.length > 0) return a + "=" + x.getAttribute(a);
                }).join("/");

            if (album_id === null) {
                return "";
            }

            if (bandcamp_width !== null || bandcamp_width !== "") {
                frame_width += '"' + bandcamp_width + '" ';
            } else {
                frame_width += '"" ';
            }
            if (bandcamp_height !== null || bandcamp_height !== "") {
                frame_height += '"' + bandcamp_height + '" ';
            } else {
                frame_height += '"" ';
            }

            let src = 'https://bandcamp.com/EmbeddedPlayer/album=' + album_id + '/' + params;

            return '<iframe title="' + frame_title + '"' + frame_width + frame_height + ' src="' + src + '" frameborder="0" allowfullscreen seamless></iframe>';
        });
    },
    fallback: function () {
        TarteAuCitron.fallback(['bandcamp_player'], function (elem) {
            elem.style.width = elem.getAttribute('width');
            elem.style.height = elem.getAttribute('height');
            return TarteAuCitron.engage('bandcamp');
        });
    }
};

// Discord Widget
export let discord = {
    "key": "discord",
    "type": "social",
    "name": "Discord (Server Widget)",
    "needConsent": true,
    "options": {},
    "cookies": ["__cfruid", "__dcfduid", "_ga", "_gcl_au", "OptanonConsent", "locale", "_gid"],
    "uri": "https://discord.com/privacy",
    "js": function () {
        TarteAuCitron.fallback(['discord_widget'], function (x) {
            let id = x.getAttribute("guildID"),
                width = x.getAttribute("width"),
                height = x.getAttribute("height")
            let widgetURL = "https://discord.com/widget?id=" + id;
            return "<iframe width=\"" + width + "\" height=\"" + height + "\" src=\"" + widgetURL + "\"></iframe>";
        });
    },
    "fallback": function () {
        let id = 'discord';
        TarteAuCitron.fallback(['discord_widget'], function (elem) {
            elem.style.width = elem.getAttribute('width') + 'px';
            elem.style.height = elem.getAttribute('height') + 'px';
            return TarteAuCitron.engage(id);
        });
    }
};

// Google Maps
export let maps_noapi = {
    "key": "maps_noapi",
    "type": "other",
    "name": "Google Maps",
    "needConsent": true,
    "options": {},
    "cookies": ["NID", "OGPC", "1P_JAR", "CONSENT"],
    "uri": "https://policies.google.com/privacy",
    "js": function () {
        TarteAuCitron.fallback(['googlemaps_embed'], function (x) {
            let id = x.getAttribute("id"),
                width = x.getAttribute("width"),
                height = x.getAttribute("height")
            let widgetURL = "https://google.com/maps/embed?pb=" + id;
            return "<iframe width=\"" + width + "\" height=\"" + height + "\" src=\"" + widgetURL + "\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\"></iframe>";
        });
    },
    "fallback": function () {
        let id = 'maps_noapi';
        TarteAuCitron.fallback(['googlemaps_embed'], function (elem) {
            elem.style.width = elem.getAttribute('width') + 'px';
            elem.style.height = elem.getAttribute('height') + 'px';
            return TarteAuCitron.engage(id);
        });
    }
};

// hCaptcha
export let hcaptcha = {
    "key": "hcaptcha",
    "type": "other",
    "name": "hCaptcha",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "uri": "https://www.hcaptcha.com/privacy",
    "js": function () {
        TarteAuCitron.fallback(["h-captcha"], '');
        TarteAuCitron.addScript("https://hcaptcha.com/1/api.js", "hcaptcha")
    },
    "fallback": function () {
        let id = "hcaptcha";
        TarteAuCitron.fallback(["h-captcha"], TarteAuCitron.engage(id));
    }
};

// France Culture
export let fculture = {
    "key": "fculture",
    "type": "video",
    "name": "France Culture",
    "needConsent": true,
    "options": {},
    "cookies": ["_gid", "didomi_token", "outbrain_cid_fetch", "xtvrn", "xtant", "YSC", "ABTasty", "xtan", "ABTastySession", "xtidc", "_ga", "VISITOR_INFO1_LIVE", "euconsent-v2", "v1st", "dmvk", "ts", "VISITOR_INFO1_LIVE", "YSC"],
    "uri": "https://www.radiofrance.com/politique-d-utilisation-des-cookies-sur-les-sites-internet-du-groupe-radio-france",
    "js": function () {
        TarteAuCitron.fallback(['fculture_embed'], function (x) {
            let id = x.getAttribute('id'),
                width = x.getAttribute('width'),
                height = x.getAttribute('height');
            return "<iframe src=\"https://www.franceculture.fr/player/export-reecouter?content=" + id + "\" height=\"" + height + "\" width=\"" + width + "\"></iframe>"
        });
    },
    "fallback": function () {
        let id = "fculture";
        TarteAuCitron.fallback(["fculture_embed"], TarteAuCitron.engage(id));
    }
};

// Acast
export let acast = {
    "key": "acast",
    "type": "video",
    "name": "Acast",
    "needConsent": true,
    "options": {},
    "cookies": ["intercom-id-ayi0335i", "intercom-session-ayi0335i"],
    "uri": "https://www.acast.com/en/privacy",
    "js": function () {
        TarteAuCitron.fallback(['acast_embed'], function (x) {
            let id = x.getAttribute('id1'),
                id2 = x.getAttribute('id2'),
                width = x.getAttribute('width'),
                height = x.getAttribute('height'),
                seek = x.getAttribute('seek');
            let widgetURL = "https://embed.acast.com/" + id + "/" + id2 + "?seek=" + seek;
            return "<iframe title=\"Embed Player\" width=\"" + width + "\" height=\"" + height + "\" src=\"" + widgetURL + "\" scrolling=\"no\" frameBorder=\"0\" style=\"border: none; overflow: hidden;\"></iframe>";
        });
    },
    "fallback": function () {
        let id = "acast";
        TarteAuCitron.fallback(["acast_embed"], TarteAuCitron.engage(id));
    }
};

// Mixcloud
export let mixcloud = {
    "key": "mixcloud",
    "type": "video",
    "name": "Mixcloud",
    "needConsent": true,
    "options": {},
    "cookies": ["UID", "_gat", "__stripe_mid", "_gid", "_ga", "c", "csrftoken", "__stripe_sid", "mx_t"],
    "uri": "https://www.mixcloud.com/privacy/",
    "js": function () {
        TarteAuCitron.fallback(['mixcloud_embed'], function (x) {
            let id = x.getAttribute('id'),
                hidecover = x.getAttribute('hidecover'),
                mini = x.getAttribute('mini'),
                light = x.getAttribute('light'),
                width = x.getAttribute('width'),
                height = x.getAttribute('height');
            return "<iframe width=\"" + width + "\" height=\"" + height + "\" src=\"https://www.mixcloud.com/widget/iframe/?hide_cover=" + hidecover + "&mini=" + mini + "&light=" + light + "&feed=" + id + "\" frameborder=\"0\" ></iframe>";
        });
    },
    "fallback": function () {
        let id = "mixcloud";
        TarteAuCitron.fallback(["mixcloud_embed"], TarteAuCitron.engage(id));
    }
};

// Google Agenda
export let gagenda = {
    "key": "gagenda",
    "type": "other",
    "name": "Google Agenda",
    "needConsent": true,
    "options": {},
    "cookies": ["CONSENT", "NID"],
    "uri": "https://policies.google.com/privacy",
    "js": function () {
        TarteAuCitron.fallback(['gagenda_embed'], function (x) {
            let calendar_data = x.getAttribute('data'),
                width = x.getAttribute('width'),
                height = x.getAttribute('height');
            return "<iframe loarding=\"lazy\" width=\"" + width + "\" height=\"" + height + "\" src=\"https://www.google.com/calendar/embed?" + calendar_data + "\" frameborder=\"0\" scrolling=\"no\" style=\"border-width:0\"></iframe>";
        });
    },
    "fallback": function () {
        let id = "gagenda";
        TarteAuCitron.fallback(["gagenda_embed"], TarteAuCitron.engage(id));
    }
};

// Google Docs
export let gdocs = {
    "key": "gdocs",
    "type": "other",
    "name": "Google Docs",
    "needConsent": true,
    "options": {},
    "cookies": ["CONSENT", "NID"],
    "uri": "https://policies.google.com/privacy",
    "js": function () {
        TarteAuCitron.fallback(['gdocs_embed'], function (x) {
            let id = x.getAttribute('id'),
                width = x.getAttribute('width'),
                height = x.getAttribute('height');
            return "<iframe width=\"" + width + "\" height=\"" + height + "\" src=\"https://docs.google.com/document/d/e/" + id + "/pub?embedded=true\"></iframe>";
        });
    },
    "fallback": function () {
        let id = "gdocs";
        TarteAuCitron.fallback(["gdocs_embed"], TarteAuCitron.engage(id));
    }
};

// Google Sheets
export let gsheets = {
    "key": "gsheets",
    "type": "other",
    "name": "Google Sheets",
    "needConsent": true,
    "options": {},
    "cookies": ["CONSENT", "NID"],
    "uri": "https://policies.google.com/privacy",
    "js": function () {
        TarteAuCitron.fallback(['gsheets_embed'], function (x) {
            let id = x.getAttribute('id'),
                width = x.getAttribute('width'),
                height = x.getAttribute('height'),
                headers = x.getAttribute('headers');
            return "<iframe width=\"" + width + "\" height=\"" + height + "\" src=\"https://docs.google.com/spreadsheets/d/e/" + id + "/pubhtml?widget=true&amp;headers=" + headers + "\"></iframe>";
        });
    },
    "fallback": function () {
        let id = "gsheets";
        TarteAuCitron.fallback(["gsheets_embed"], TarteAuCitron.engage(id));
    }
};

// Google Slides
export let gslides = {
    "key": "gslides",
    "type": "other",
    "name": "Google Slides",
    "needConsent": true,
    "options": {},
    "cookies": ["CONSENT", "NID"],
    "uri": "https://policies.google.com/privacy",
    "js": function () {
        TarteAuCitron.fallback(['gslides_embed'], function (x) {
            let id = x.getAttribute('id'),
                width = x.getAttribute('width'),
                height = x.getAttribute('height'),
                autostart = x.getAttribute('autostart'),
                loop = x.getAttribute('loop'),
                delay = x.getAttribute('delay');
            return "<iframe width=\"" + width + "\" height=\"" + height + "\" src=\"https://docs.google.com/presentation/d/e/" + id + "/embed?start=" + autostart + "&loop=" + loop + "&delayms=" + delay + "\" frameborder=\"0\" allowfullscreen=\"true\" mozallowfullscreen=\"true\" webkitallowfullscreen=\"true\"></iframe>";
        });
    },
    "fallback": function () {
        let id = "gslides";
        TarteAuCitron.fallback(["gslides_embed"], TarteAuCitron.engage(id));
    }
};

// Google Forms
export let gforms = {
    "key": "gforms",
    "type": "other",
    "name": "Google Forms",
    "needConsent": true,
    "options": {},
    "cookies": ["CONSENT", "NID"],
    "uri": "https://policies.google.com/privacy",
    "js": function () {
        TarteAuCitron.fallback(['gforms_embed'], function (x) {
            let id = x.getAttribute('id'),
                width = x.getAttribute('width'),
                height = x.getAttribute('height');
            return "<iframe width=\"" + width + "\" height=\"" + height + "\" src=\"https://docs.google.com/forms/d/e/" + id + "/viewform?embedded=true\" frameborder=\"0\" marginheight=\"0\" marginwidth=\"0\"></iframe>";
        });
    },
    "fallback": function () {
        let id = "gforms";
        TarteAuCitron.fallback(['gforms_embed'], TarteAuCitron.engage(id));
    }
};

// Google Optimize
export let goptimize = {
    "key": "goptimize",
    "type": "other",
    "name": "Google Optimize",
    "needConsent": true,
    "options": {},
    "cookies": ["CONSENT", "NID"],
    "uri": "https://policies.google.com/privacy",
    "js": function () {

        if (this.options.goptimize === undefined) {
            return;
        }

        TarteAuCitron.addScript('https://www.googleoptimize.com/optimize.js?id=' + this.options.goptimize);
    }
};

// Marketo munchkin
export let marketomunchkin = {
    "key": "marketomunchkin",
    "type": "api",
    "name": "Marketo munchkin",
    "uri": "https://documents.marketo.com/legal/cookies",
    "needConsent": true,
    "options": {},
    "cookies": ['OptAnon', '_mkto_trk'],
    "js": function () {
        if (this.options.marketomunchkinkey === undefined) {
            return;
        }
        let didInit = false;
        function initMunchkin() {
            if (didInit === false) {
                didInit = true;
                Munchkin.init(this.options.marketomunchkinkey);
            }
        }
        let s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = '//munchkin.marketo.net/munchkin.js';
        s.onreadystatechange = function () {
            if (this.readyState === 'complete' || this.readyState === 'loaded') {
                initMunchkin();
            }
        };
        s.onload = initMunchkin;
        document.getElementsByTagName('head')[0].appendChild(s);
    }
};

// outbrain
export let outbrain = {
    "key": "outbrain",
    "type": "ads",
    "name": "Outbrain",
    "uri": "https://www.outbrain.com/fr/advertisers/guidelines/",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {

        TarteAuCitron.addScript('https://widgets.outbrain.com/outbrain.js');
    }
};

// affilae
export let affilae = {
    "key": "affilae",
    "type": "ads",
    "name": "Affilae",
    "uri": "https://affilae.com/en/privacy-cookie-policy/",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {

        if (this.options.affilae === undefined) {
            return;
        }

        window._ae = { "pid": this.options.affilae };

        TarteAuCitron.addScript('https://static.affilae.com/ae-v3.5.js');
    }
};

// Canal-U.tv
export let canalu = {
    "key": "canalu",
    "type": "video",
    "name": "Canal-U.tv",
    "uri": "https://www.canal-u.tv/utilisation-des-cookies/",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        TarteAuCitron.fallback(['canalu_player'], function (x) {
            let video_title = TarteAuCitron.fixSelfXSS(x.getAttribute("videoTitle")),
                frame_url = 'https://www.canal-u.tv/video/embed_code_plugin.1/' + video_title;

            return '<div style="position:relative;padding-bottom:56.25%;padding-top:10px;height:0;overflow:hidden;">' +
                '<iframe src="' + frame_url + '?width=100%&amp;height=100%" ' +
                'style="position:absolute;top:0;left:0;width:100%;height: 100%;" ' +
                'frameborder="0" ' +
                'allowfullscreen ' +
                'scrolling="no">' +
                '</iframe>' +
                '</div>';
        });
    },
    "fallback": function () {
        TarteAuCitron.fallback(['canalu_player'], function (elem) {
            return TarteAuCitron.engage('canalu');
        });
    }
};

// WebTV Normandie Université
export let webtvnu = {
    "key": "webtvnu",
    "type": "video",
    "name": "WebTV Normandie Université",
    "uri": "https://docs.google.com/document/d/1tpVclj4QBoAq1meSZgYrpNECwp7dbmb_IhICY3sTl9c/edit",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {
        TarteAuCitron.fallback(['webtvnu_player'], function (x) {
            let frame_url = 'https://webtv.normandie-univ.fr/permalink/' + x.getAttribute("videoID") + '/iframe/',
                width = x.getAttribute("width"),
                height = x.getAttribute("height");

            return '<iframe width="' + width + '" height="' + height + '" src="' + frame_url + '" allowfullscreen="allowfullscreen" allow="autoplay"></iframe>';
        });
    },
    "fallback": function () {
        TarteAuCitron.fallback(['webtvnu_player'], function (elem) {
            return TarteAuCitron.engage('webtvnu');
        });
    }
};

// studizz
export let studizz = {
    "key": "studizz",
    "type": "other",
    "name": "Studizz Chatbot",
    "uri": "https://group.studizz.fr/",
    "needConsent": true,
    "options": {},
    "cookies": [],
    "js": function () {

        if (this.options.studizzToken === undefined) {
            return;
        }

        TarteAuCitron.addScript('https://webchat.studizz.fr/webchat.js?token=' + this.options.studizzToken);
    }
};
