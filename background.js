//Seraphina Anderson Oct/Nov 2015

// #tasks

var PERSIST_SHOW = "showIcon";
var bookmarkletOrigin = localStorage["bookmarklet_origin"] || "SizeCheckerURL_path";
var storesVerifyOrigin =  localStorage["storesVerifyOrigin"] || "SizeCheckerURL_path";
var slider_enabled = (localStorage["slider_notification"]) || 'enabled';

console.log("bookmarkletOrigin retrieved as : " + localStorage["bookmarklet_origin"]);
var bookmarkletPath = localStorage["bookmarklet_path"] || "/tagr.js";
var mode = localStorage["mode"] || 'live';

updateBrowserActionFromUrl = function(a, tab_id, mode) {
  chrome.browserAction.setIcon({path:"/icons/19x19.png"}); 

  u = new URL(a);
  host_name = u.hostname;
  //alert(window.location.hostname)
  
  //alert(u.hostname)
  //#2 change this to correspond to fashsquare
  if (a && (a != "chrome://newtab/") && (a.indexOf('chrome://') == -1) && (a.indexOf('translate.google.com') == -1)
    && (a.indexOf('www.facebook.com') == -1) && (a.indexOf('go.sizeChecker.com') == -1) && (a.indexOf('www.google.com') == -1)) {

      if (a.indexOf("pinterest.com/") > -1){
        console.log("In Pinterest");
      }

      else {

        //if host_name
       var whiteList = localStorage["urlWhiteList"].split(',');

        d = !1;
        for (var g = null, f = 0; f < whiteList.length; f++){
          if (a.indexOf(whiteList[f]) > -1) {
              d = !0;
              g = whiteList[f];
              break;
          }
        }

        if (d == !1)
          return;
      }
      
      //#3 sets icon green, when url is recognised from whitelist
      chrome.browserAction.setIcon({path:"icons/19x19_green.png"});
      if (mode =="switch"){
        return;
      }
    }
};

chrome.tabs.onActivated.addListener(function(a) {
    chrome.tabs.get(a.tabId, function(a) {
        updateBrowserActionFromUrl(a.url ? a.url : a.id, a.id, "switch")
    })
});

//#4 find out what "getstate" does
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "getState"}, function(response) {
      if (response.state && (response.state == "autoTagging")){
        chrome.tabs.executeScript(tab.id, {file: "autotagging.js"})
      }

      else if (response.state && (response.state == "manualTagging")){
        chrome.tabs.executeScript(tab.id, {file: "bookmarklet.js"})
      }
    });
  });    
});

//#5 determine whether to make icon green or black...
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab){
  if (changeInfo.status == "complete" ){
    updateBrowserActionFromUrl(tab.url, tabId, "updated")
  }
  else{
    updateBrowserActionFromUrl(tab.url, tabId, "switch")
  }
});

chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
  if (request) {
    if (request.message) {
      if (request.message == "version") {
        sendResponse({version: 1.0});
      }
    }
   }
  return true;
 });



chrome.runtime.onMessage.addListener(
  function( message, sender, onComplete ) 
  {
    switch( message.type )
    {
      
      case "getLocalStorage":
        onComplete({"data": localStorage[message.key]});
        return true;
      //#6 can remove this code
      case "openPrefs":
        window.open(chrome.extension.getURL("options.html"));
        return true;
        
      default:
        return false; 
    }
  }
);

//Check whether new version is installed
//#7 may not need this
chrome.runtime.onInstalled.addListener(function(details){
  // override bookmarklet_origin for https
  bookmarkletOrigin = localStorage["bookmarklet_origin"] = "SizeCheckerURL_path";
  console.log("Bookmarklet Origin overriden on install or upgrade to " + bookmarkletOrigin);
  var thisVersion = chrome.runtime.getManifest().version;
  if(details.reason == "install"){
      console.log("This is a first install");
      chrome.tabs.create({ url: "SizeCheckerURL_path" });
  }
  else if(details.reason == "update"){
    console.log("Updated from " + details.previousVersion + " to " + thisVersion);
  }
});

if (localStorage[ PERSIST_SHOW ] == null)
  localStorage[ PERSIST_SHOW ] = true;
//This whitelist needs replacing with Sizechecker whitelist
localStorage["urlWhiteList"] = ["www.lanecrawford.com", "www.mcmworldwide.com", "www.cichic.com", "www.chicnova.com", "www.agjeans.com", "www.everythingbutwater.com", "ae.com" , "www.stylerunner.com", "bonobos.com", "www.kurtgeiger.us", "www.wildfox.com", "www.lazyoaf.com", "www.monki.com", "www.iherb.com", "www.fanatics.com", "www.lolashoetique.com", "us.missselfridge.com", "www.paige.com", "www.benefitcosmetics.com", "www.adriannapapell.com", "art-object.totokaelo.com", "man.totokaelo.com", "totokaelo.com", "www.splendid.com", "zady.com", "www.gap.eu", "www.eileenfisher.com", "ayr.com", "www.potterybarnkids.com", "it.benetton.com", "us.benetton.com", "www.pixiemarket.com", "www.mangooutlet.com", "www.stevemadden.ca", "www.spanx.com", "www.missselfridge.com", "www.cosstores.com", "www2.hm.com", "www.homedepot.com", "www.forzieri.com", "www.dagnedover.com", "www.reebok.com", "fancy.com", "us.billabong.com", "www.hanes.com", "www.amuze.com", "www.vonmaur.com", "www.halston.com", "www.wisteria.com", "www.shoplesnouvelles.com", "www.burlingtoncoatfactory.com", "www.bonton.com", "www.shoppinkblush.com", "shop.forloveandlemons.com", "www.sanuk.com", "www.claires.com", "www.claires.co.uk", "www.eyeslipsface.com", "www.nydj.com", "www.ikea.com", "www.joefresh.com", "www.ebay.com.au", "www.yesstyle.com.au", "www.mzwallace.com", "www.alexandani.com","www.sigmabeauty.com","www.fitgown.com","www.jackspade.com","www.urbandecay.com","www.spylovebuy.com","loveculture.com","www.loveculture.com","nimbleactivewear.com", "www.houzz.com" ,"www.aninebing.com" ,"tjmaxx.tjx.com" ,"www.axparis.com" ,"thirdlove.com" ,"www.amiclubwear.com" ,"profoundco.com" ,"www.sundancebeach.com" ,"www.thebodyshop-usa.com" ,"www.coclico.com" ,"www.beautybay.com" ,"www.hotter.com" ,"www.footnotesonline.com" ,"www.fashionphile.com" ,"unifclothing.com" ,"www.thebay.com" ,"www.candelanyc.com" ,"www.necessaryclothing.com" ,"shop.tlroom.com" ,"realtechniques.com" ,"www.jollychic.com" ,"www.jackwills.com" ,"ldtuttle.com" ,"www.williams-sonoma.com" ,"www.zalando.dk" ,"us.accessorize.com" ,"www.stylemint.com" ,"www.prada.com" ,"usa.tommy.com" ,"www.joyus.com" ,"www.romwe.com" ,"www.lamoda.ru" ,"www.lucy.com" ,"fab.com" ,"www.fashionnova.com" ,"www.francescas.com" ,"www.blueandcream.com" ,"www.boden.co.uk" ,"www.bodenusa.com" ,"www.dl1961.com" ,"www.whistles.com" ,"www.hotmiamistyles.com" ,"us.charlotteolympia.com" ,"www.sunglasshut.com" ,"www.equipmentfr.com" ,"uk.burberry.com" ,"www.solestruck.com" ,"www.sachacosmetics.com" ,"us.puma.com" ,"shopplanetblue.com" ,"www.modaoperandi.com" ,"www.southmoonunder.com" ,"www.dollskill.com" ,"www.boutiquetoyou.com" ,"us.urbanoutfitters.com" ,"www.famousfootwear.com" ,"www.vineyardvines.com" ,"www.loefflerrandall.com" ,"www.ferragamo.com" ,"www.zulily.com" ,"www.goodnightmacaroon.co" ,"www.fabrixquare.com" ,"www.bostonproper.com" ,"www.journelle.com" ,"www.abercrombiekids.com" ,"www.savvywatch.com" ,"www.nautica.com" ,"www.columbia.com" ,"morphebrushes.com" ,"hazelandolive.com" ,"www.thedreslyn.com" ,"www.kendrascott.com" ,"www.missguided.eu" ,"www.nakedwardrobe.com" ,"www.scotch-soda.com" ,"www.bcbgeneration.com" ,"www.cr8rec.com" ,"fiftyfactory.com/" ,"www.countryoutfitter.com" ,"www.samedelman.com" ,"www.tiffany.com" ,"www.eshakti.com" ,"www.anjaliclothing.com" ,"www.luluandgeorgia.com" ,"www.rue21.com" ,"www.thefryecompany.com" ,"eu.riverisland.com" ,"www.nyxcosmetics.com" ,"www.windsorstore.com" ,"www.singer22.com" ,"www.superdry.com" ,"www.barneyswarehouse.com" ,"www.vince.com" ,"itcosmetics.com" ,"www.whitehouseblackmarket.com" ,"www.coastalscents.com" ,"www.torrid.com" ,"www.ruelala.com" ,"www.aeropostale.com" ,"www.nastygal.com.au" ,"www.dynamiteclothing.com" ,"www.qvc.com" ,"www.missguidedau.com" ,"www.parfois.com" ,"www.shoedazzle.com" ,"www.90slullaby.com" ,"eu.abercrombie.com" ,"www.journeys.com" ,"zooshoo.com" ,"www.zumiez.com" ,"www.reiss.com" ,"www.urbanog.com" ,"www.agacistore.com" ,"www.lipsy.co.uk" ,"www.lushusa.com" ,"www.victoriassecret.com" ,"www.ahalife.com" ,"www.hollisterco.ca" ,"bananarepublic.gapcanada.ca" ,"http://bananarepublic.gap.eu" ,"www.dailylook.com" ,"http://www.stories.com" ,"https://www.toofaced.com" ,"www.yesstyle.ca" ,"http://www.yesstyle.com" ,"www.figleaves.com" ,"http://www.elaineturner.com/" ,"http://tnuck.com" ,"us.sheinside.com/" ,"http://www.tillys.com" ,"nastygal.com/" ,"http://www.patagonia.com" ,"http://www.dolcevita.com" ,"www.glassons.com" ,"www.dresslily.com/" ,"http://nelly.com" ,"http://www.tomford.com" ,"www.walmart.com" ,"marketplace.asos.com" ,"www.newlook.com" ,"www.laredoute.com/" ,"http://www.avenuek.com/" ,"www.coast-stores.com" ,"http://www.teva.com/" ,"http://www.eddiebauer.com/" ,"http://www.lyst.com/" ,"http://www.bluefly.com/" ,"http://www.kmart.com/" ,"http://www.hurley.com/" ,"www.thereformation.com" ,"http://arcteryx.com/" ,"http://www.acnestudios.com/" ,"http://www.barenecessities.com/" ,"http://eu.topshop.com/" ,"http://www.johnlewis.com/" ,"http://www.ghbass.com/" ,"http://www.marcwenn.com/" ,"http://www.naja.co/" ,"http://www.us.allsaints.com/" ,"https://www.everlane.com/" ,"www.ssense.com" ,"www.elietahari.com" ,"http://www.dressbarn.com/" ,"http://www.gilt.com/" ,"http://us.louisvuitton.com/" ,"http://www.zgallerie.com/" ,"http://www.camper.com/" ,"store-us.hugoboss.com/" ,"http://www.alexanderwang.com/" ,"http://www.target.com.au/" ,"http://www.frontrowshop.com/" ,"http://www.aliexpress.com/" ,"https://www.oliverbonas.com" ,"us.topman.com" ,"www.topman.com" ,"http://www.lkbennett.com/" ,"http://us.lkbennett.com/" ,"http://edie-parker.com/" ,"http://www.sammydress.com/" ,"http://www.roxy.com/" ,"www.dkny.com" ,"http://www.jimmychoo.com/" ,"http://us.jimmychoo.com/" ,"www.zalando.de" ,"http://www.tibi.com/" ,"http://www.disneystore.com/" ,"http://www.eloquii.com/" ,"http://www.oaknyc.com/" ,"http://www.luckybrand.com/" ,"http://www.massimodutti.com/" ,"http://www.jjill.com/" ,"http://www.vans.com/" ,"http://www.karenwalker.com/" ,"https://kieljamespatrick.com" ,"http://www.theory.com/" ,"http://www.bbdakota.com/" ,"http://www.onlineshoes.com/" ,"http://couture.zappos.com/" ,"http://www.armaniexchange.com/" ,"http://www.thelimited.com/" ,"http://www.thenorthface.com/" ,"http://www.houseoffraser.co.uk/" ,"http://www.ray-ban.com/" ,"https://www.nordstromrack.com/" ,"http://www.thetiebar.com/" ,"http://www.cusp.com/" ,"http://www.westelm.com/" ,"http://www.shoptiques.com/" ,"http://peekkids.com/" ,"http://bananarepublic.gap.co.uk/" ,"http://www.gapcanada.ca/" ,"http://www.baublebar.com/" ,"http://www.oakley.com/" ,"http://www.londonsole.com/" ,"http://beautifuldreamers.com/" ,"http://www.abercrombie.ca/" ,"http://shop.guess.com/" ,"http://us.suitsupply.com/" ,"http://eu.suitsupply.com" ,"http://needsupply.com/" ,"http://www.rebeccaminkoff.com/" ,"www.anthropologie.eu" ,"us.anthropologie.com" ,"http://www.heels.com/" ,"www.lacoste.com" ,"http://www.hottopic.com/" ,"http://www.warehouse.co.uk/" ,"http://www.jwhulmeco.com/" ,"http://www.danner.com/" ,"http://www.payless.com/" ,"www.zalando.nl" ,"http://www.wrangler.com/" ,"http://www.tumi.com/" ,"http://www.harrods.com/" ,"www.oasap.com" ,"http://www.kurtgeiger.com/" ,"www.brandymelvilleusa.com" ,"http://www.kupivip.ru/" ,"http://alluret.com/" ,"http://us.wconcept.com/" ,"www.charlotterusse.com" ,"http://us.dorothyperkins.com/" ,"http://www.dorothyperkins.com/" ,"www.oki-ni.com" ,"http://www.paulsmith.co.uk/" ,"https://www.madewell.com/" ,"www.garageclothing.com" ,"http://www.gucci.com/" ,"http://www.soma.com/" ,"www.henribendel.com" ,"http://www.oneillclothing.com/" ,"http://www.halsbrook.com/" ,"http://www.adidas.com/" ,"www.uggaustralia.com" ,"http://www.nicolemiller.com/" ,"http://www.garnethill.com/" ,"http://www.pacsun.com/" ,"http://www.solesociety.com/" ,"http://www.tedbaker.com" ,"http://www.kennethcole.com/" ,"http://www.ninewest.com/" ,"www.missguided.co.uk" ,"http://www.missguidedus.com/" ,"http://athleta.gap.com/" ,"https://www.jcrew.com/" ,"http://www.asos.de/" ,"http://www.asos.fr/" ,"http://www.clubmonaco.com/" ,"http://www.flyingwardrobe.com/" ,"http://www.fossil.com/" ,"www.lookbookstore.co" ,"http://www.dickssportinggoods.com/" ,"http://www.choies.com/" ,"https://www.etsy.com" ,"http://us.aritzia.com/" ,"http://www.verabradley.com/" ,"http://www.staples.com/" ,"http://www.dsw.com/" ,"http://www.mulberry.com/" ,"http://www.bloggerscloset.com/" ,"http://www.lastcall.com/" ,"http://bananarepublic.gap.com/" ,"www.michaelkors.com/" ,"http://www.notonthehighstreet.com/" ,"www.abercrombie.com" ,"http://canada.forever21.com/" ,"http://www.forever21.com/" ,"http://www.cuyana.com/" ,"http://www.coldwatercreek.com/" ,"http://www.converse.com/" ,"http://canada.frenchconnection.com/" ,"http://www.picklesandicecream.com/" ,"http://www.lookfantastic.com/" ,"http://www.livingspaces.com/" ,"http://www.trinaturk.com/" ,"http://www.dillards.com/" ,"http://www.9straatjesonline.com/" ,"http://www.castro.com/" ,"http://www.adikastyle.com/" ,"http://www.zara.com/" ,"www.riverisland.com" ,"http://us.topshop.com/" ,"http://www.sheinside.com/" ,"http://oldnavy.gap.com/" ,"http://styleriver.mako.co.il/" ,"http://www.neimanmarcus.com/" ,"http://www.ralphlauren.com/" ,"www.shoes.com" ,"http://www.maurices.com/" ,"http://www.topshop.com/" ,"http://www.rickis.com/" ,"http://il.nextdirect.com/" ,"http://us.nextdirect.com/" ,"http://www.keds.com/" ,"http://www.bergdorfgoodman.com/" ,"http://piperlime.gap.com/" ,"http://shop.reebok.com/" ,"http://store.delias.com/" ,"us.hunterboots.com" ,"www.hunterboots.com" ,"http://www.target.com/" ,"shopruche.com/" ,"www.zalando.it" ,"www.cathkidston.com" ,"http://www.toms.co.uk/" ,"http://www.worldmarket.com/" ,"www.nastygal.com" ,"http://www.next.co.uk/" ,"http://www.amazon.co.uk/" ,"http://www.gap.com/" ,"www.prana.com" ,"http://www.toms.com/" ,"http://www.bonadrag.com/" ,"http://www.zappos.com/" ,"http://www.marksandspencer.com/" ,"http://www1.bloomingdales.com/" ,"http://www.alloyapparel.com/" ,"http://www.aliceandolivia.com/" ,"http://www.yoox.com/" ,"http://www.wetseal.com/" ,"http://www.wayfair.com/" ,"www.walgreens.com" ,"http://www.uniqlo.com/" ,"www.underarmour.com" ,"http://www.uncommongoods.com/" ,"http://www.ulta.com/" ,"http://www.uggaustralia.eu/" ,"www.toryburch.com/" ,"www.tobi.com" ,"http://www.thinkgeek.com/" ,"http://www.theoutnet.com/" ,"http://www.landofnod.com/" ,"http://www.thecorner.com/" ,"http://www.shopterrain.com/" ,"http://www.talbots.com/" ,"http://www.swell.com/" ,"http://www.sweatybetty.com/" ,"http://www.stevenalan.com/" ,"www.stevemadden.com" ,"http://www.stelladot.com/" ,"http://www.sperrytopsider.com/" ,"http://www.jonathanadler.com/" ,"www.hollisterco.com" ,"http://www.gojane.com/" ,"http://www.frys.com/" ,"http://www.containerstore.com/" ,"http://www.cabelas.com/" ,"http://www.bestbuy.com/" ,"http://society6.com/" ,"http://www.soap.com/" ,"http://www.shoebuy.com/" ,"www.sephora.com" ,"http://www.saksoff5th.com/" ,"http://www.saksfifthavenue.com/" ,"http://us.riverisland.com/" ,"http://www.rhbabyandchild.com/" ,"http://www.revolveclothing.com/" ,"http://www.rei.com/" ,"http://www.rebeccataylor.com/" ,"www.rag-bone.com" ,"http://www.pier1.com/" ,"http://patriciafield.com/" ,"http://www.overstock.com/" ,"http://www.oshkosh.com/" ,"http://store.nike.com/" ,"http://www.nyandcompany.com/" ,"http://www.nau.com/" ,"http://www.modells.com/" ,"http://www.modcloth.com/" ,"shop.mango.com" ,"www.marcjacobs.com" ,"http://www.lordandtaylor.com/" ,"http://shop.lululemon.com/" ,"www.lulus.com" ,"http://www.loft.com/" ,"http://www.lillypulitzer.com/" ,"http://us.levi.com/" ,"http://www.landsend.com/" ,"http://www.ladyfootlocker.com/" ,"http://www.llbean.com/" ,"http://www.kohls.com/" ,"www.saturday.com" ,"www.coach.com" ,"http://lux-fix.com/" ,"http://www.boohoo.com/" ,"http://goodhoodstore.com/" ,"http://www.katespade.com/" ,"http://www.karmaloop.com/" ,"http://www.juicycouture.com/" ,"http://www.joie.com/" ,"www.johnvarvatos.com" ,"http://www.jcpenney.com/" ,"factory.jcrew.com" ,"http://www.intermixonline.com/" ,"http://www.hsn.com/" ,"http://www.helmutlang.com/" ,"http://www.hm.com/" ,"http://www.guess.com/" ,"http://usa.frenchconnection.com/" ,"http://www.freepeople.com/" ,"www.anthropologie.com" ,"http://www.anntaylor.com/" ,"www.aldoshoes.com" ,"www.6pm.com" ,"http://www.austique.co.uk/" ,"http://www.london-boutiques.com/" ,"http://www.shelikes.com/" ,"www.debenhams.com" ,"http://www.urbanoutfitters.com/" ,"http://www.my-wardrobe.com/" ,"http://www.mytheresa.com/" ,"www.matchesfashion.com" ,"http://www.harveynichols.com/" ,"http://www.3939shop.com/" ,"http://www.theukedit.com/" ,"http://www.vestiairecollective.com/" ,"http://www.kabiri.co.uk/" ,"www.fwrd.com" ,"http://www.footlocker.com/" ,"www.finishline.com" ,"http://www.filson.com/" ,"http://www.express.com/" ,"http://www.etsy.com/" ,"www.ebay.com" ,"http://www.ebags.com/" ,"www.eastbay.com" ,"www.eastdane.com" ,"http://www.dvf.com/" ,"http://www.drugstore.com/" ,"http://www.dogeared.com/" ,"http://www.diapers.com/" ,"www.dermstore.com" ,"http://www.crateandbarrel.com/" ,"http://www.colehaan.com/" ,"http://www.charliebymz.com/" ,"www.cb2.com" ,"http://www.carters.com/" ,"http://www.cwonder.com/" ,"us.burberry.com" ,"www.brookstone.com" ,"http://www.brooksbrothers.com/" ,"http://www.bhldn.com/" ,"http://www.belk.com/" ,"http://www.bedbathandbeyond.com/" ,"http://www.bebe.com/" ,"http://www.beauty.com/" ,"www.bcbg.com" ,"http://www.barneys.com/" ,"http://www.backcountry.com/" ,"http://www.bhphotovideo.com/" ,"http://aritzia.com/" ,"www.ae.com" ,"http://store.americanapparel.net/" ,"http://www.allsaints.com/" ,"www.selfridges.com/" ,"http://www.seftonfashion.com/" ,"http://www.the-dressingroom.com/" ,"http://www.cricket-fashion.com/" ,"www.zalando.co.uk" ,"www.mrporter.com" ,"http://www.stylebop.com/" ,"http://www.ebay.co.uk/" ,"http://www.lavishalice.com/" ,"http://www.luisaviaroma.com/" ,"http://www.coggles.com/" ,"www.shoescribe.com" ,"http://www.ln-cc.com/" ,"http://www.brownsfashion.com/" ,"http://www.avenue32.com/" ,"http://www.victoriabeckham.com/" ,"http://www.farfetch.com/" ,"http://www.asos.com/" ,"http://shop.nordstrom.com/" ,"http://www1.macys.com/" ,"www.net-a-porter.com" ,"http://us.asos.com/" ,"www.shopbop.com" ,"http://www.amazon.com/" ];
localStorage["bookmarkletMode"] = 0;
