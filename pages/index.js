import Footer from "@/components/Footer";
import Results from "@/components/Results";
import Search from "@/components/Search";
import React from 'react';
import Image from 'next/image';
import axios from "axios";
import { Result } from "postcss";
import { useEffect } from "react";
const { distance, closestMatch } = require("closest-match");
const api = process.env.API;

export default function Home() {

  var [inventory, setInventory] = React.useState(null)
  var [items_render, setItemRender] = React.useState(null)
  var [checked, setChecked] = React.useState(false)
  var [states, setCheckState] = React.useState({})
  var [ai_mode, setAIMode] = React.useState(false)
  var [ai_mode_indicator, setAIModeIndicator] = React.useState("OFF")
  var [search_results_render, setRenderResults] = React.useState([])
  var [show_search_results, setShowSearchResults] = React.useState(false)
  var [search_message, setSearchMessage] = React.useState('');
  var [worddb, setWordDB] = React.useState({})
  var [suggestions, setSuggestions] = React.useState([])
  var [airesults, setAIResults] = React.useState(null)

  var category_states = { "Front Desk Closet": [], "Tools": [], "BoltDepot + Tormach Mill": [], "Design Lab": [], "Workshop": [], "Retail/Prototyping": [], "Fire Cabinet": [], "Electrical Benches": [], "Form3": [], "Mojos": [], "Objet30": [], "Drill mill": [] }
  
  var [query, setQuery] = React.useState("")
  var [mode, setMode] = React.useState("OFF")
  var [items, setItems] = React.useState("")
  var [query_result, setQueryResults] = React.useState(null)

  useEffect(() => {
    store_to_session_storage()
    wordDB_processor()
  }, [])

  function wordDB_processor(){
    var close_text = ["key #1", "focus tools/levers for laser cutters", "vinyl cutter", "dice", "scissor (new)", "waterjet wifi adapter cd driver", "battery charger", "adapter/chargers", "plain business card paper", "microsd", "stapler and opener", "staples", "batteries for calipers", "pushpins", "ruler", "sharpeners", "white-out", "binder clips", "cable organizers", "ghs chemical labels", "opical barriers", "sharpies", "white-board erasers", "expo markers", "chalk markers", "fancy labels", "paper clips", "pens", "highlighters", "white adhesive name badges", "mouse", "window marker", "folder", "monitor cords", "sony headset", "earplugs", "usb - b( for arduino)", "ethernet cords", "usb - usb (male to female)", "usb - c chargers", "mini usb - b chords", "id scanner", "micro usb charger", "cable organizer", "adaptors", "tissue", "gloves", "masks", "pens", "balloons", "copy paper", "hooks, screws, wooden blocks", "scented candles", "acrylic boards", "led stripe", "3d printing filament", "springs", "electronics (resistors, wires, leds)", "bendsaw", "ring saw (?)", "unilube", "aluminum tags", "white board cleaner", , , "mojo trays", "elite trays", "fortus trays", "f370 trays", "blue tape", "clear packing tape", "invisible tape", "masking tape", "super glue", "double sided tape", "ziploc bags", "keysight panel", "brother drum set", "hp printer", "keysight e36104a", "keysight e36104a", "\"fixtures for", "key sight lcr meter", "e4980\"", "extra basic test cables", "\"key sight", "cd + manuals\"", "extra scope probes", "\"key sight", "accesories\"", "soldering filter and mats", "soldering stations", "first aid kit", "band-aids", "alcohol prep pads", "flex-fabric adhesive bandages", "sterile gauze pads", "1/64\" bit", "ziploc with ta stuff", "spinder shell", "lids, covers, screws for dust-proofing", "vacuum port upgrade", "empty bit box", "manuals", "cloth", "hex screw", "nozzle", "washer", "screws", "beds", "pcbs", "bracket", "allen key", "z-leveler", "bantam tools accessory kit", "wood piece for shopbot trainings", "feeder spacers", "scrapper", "hex keys", "unilube", "wood stain", "threadlocker", "super glue", "glue remover", "magnalube", "ep-xtra cutting fluid", "3-in-1 multipurpose oil", "rulers", "wood filler", "gasket maker & sealant", "school glue", "hex keys", "mixed cables", "mallet (rubber)", "big clip", "multipurpose rulers", "hanging scale", "smaller saw blades", "caliper", "deburring system", "driver set", "ratchet set", "socket wrench set", "ease out kit", "metal sheer", "leveler", "hex key sets", "measuring tape", "clippers", "box cutter", "pliers", "magnifying glass", "pvc cutter", "mallet", "protractor", "wire cutters", "hand sander", "hot glue gun", "heat gun", "soldering iron", "glue sticks", "heat shrink", "a box labelled with vaccum", "spotlights", "sanding discs", "sanding belt", "fuel pump and vaccum gauge tester", "jigsaw", "hand sander (bigger)", "hand saw", "hand drill", "dremel", "heat gun", "hooks", "doubule-ended hex keys", "screwdriver bits containers", "zip ties", "blades", "hole puncturer", "screwdriver bits handle", "screwdrivers", "screwdriver bits", "big screws with black cap (?)", "embroidery hoops", "adjustable wrenches", "wrenches", "adjustable metal hoop", "steel square", "rulers", "elastic hoops", "hand saws", "scissors", "wrenches", "surform shaver", "scrapper", "screwdriver", "small wrenches", "epoxy gun", "cutters", "large pliers", "small files (in a red bag)", "large files", "big wrenches", "utility brushes", "multimeters", "\"extra multimeters", "extra mm probes\"", "breadboards", "\"usb-a to usb-b", "arduino cables\"", "arduinos", "cardboard", "micro cutters", "extension cords", "scope/dum", "cricut bag", "cricut mats", "cricut tool box", "cricut markers box", "wire cutters", "wire tools", "\"jumper cables", "extra alligator clips\"", "\"power strips", "extension cords\"", "exacto knife", "injector", "cross screws", "jumper cables", "arduino boxes", "push button switch", "other mill fan", "trimming plane", "other mill bits set", "engraving bits (1/8\" * 1/2\")", "engraving bits (1/16\" * 1/8\")", "engraving bits (1/32\" * 1/8\")", "engraving bits (0.005)", "engraving bits (30 degrees)", "drill bits in wooden container", "used pcb boards", "drill bit set (black box)", "plolymer nails", "charger", "whiteside bits", "scale button batteries", "unknow keys", "1/4\" endmill bit", "music wire", "big tweezer", "unknown orange container", "hqmaster milling cutter", "mallet (steel)", "push button switch set", "ted lele glass fuse assortment", "hole saws", "blades", "scale", "exacto knife blades", "evnovo bag with questionable objects (to be checked)", "tape (mixed types)", "black and yellow floor marker", "red floor marker", "small double sided tape", "small masking tape", "ca hinges", "relay", "lock lock box of blades", "exacto knife", "tweezers", "staple pryer", "sharpies", "whiteboard eraser", "mcmaster - carr: catalog 125", "the big book", "embroidery laptop", "embroidery laptop charger", "past notes + training guides", "extension cords", "dewalt charger dw9116", "dw9116 battery 18v", "broken wheel", "empty calliper boxes with label \"veterans future lab\"", "ez dowel kit", "nails", "limo studio table top photoshoot kit", "scrap (various materials)", "scale", "new wheel", "milwaukee wet/dry vaccume", "black box with mix of stuff in it (tape, filament, etc.)", "goggles", "mask", "ear plugs", "lens wipes", "glue", "wood glue pump", "sewing", "threads", "seam ripper", "tape measure", "scissors", "pinking scissors", "ruler", "hand needles", "sewing needles", "pin cushion with pins", "clippers", "thread holder", "singer bobbins", "large ruler", "box of pins", "box of safety pins", "rotary cutters", "rotary cutter blades", "plastic button device", "small screwdriver", "cd guide", "instruction manual", "beige container", "dust cover", "white colored pencil", "cloth", "extra white thread", "extra black thread", "questionable objects", "embroidery thread", "bobbins", "sulky kk 2000 temporary spray adhesive", "hoop", "usb cord", "tear away stabilizer", "backing material", "sewing machine service kit", "mini screwdriver", "embroidery needles", "bobbin cover plate", "cricut embroider", "white thread", "black thread", "brother bobbins", "heat gloves", "earplugs", "goggles", "wood glue", "tiny white cups", "lens wipes", "white cone dust masks", "wood glue pump", "extra earplugs", "1/4-20 x 3/4 #323", "1/4-20 nuts #2569", "5/16-18 x 3/4 #340", "5/16-18 nuts #2570", "3/8-16 x 1\" #358", "3/8-16 nuts #2571", "7/16-14 x 1\" #375", "7/16-14 nuts #2572", "1/2-13 x 1-1/2 #392", "1/2-13 x nuts #2573", "1/4-20 x 1\" #324", "5/16-18 x 1\" #341", "3/8-16 x 1-1/2 #359", "7/16-14 x 1-1/2 #377", "1/2-13 x 2\" #394", "1/4-20 x 1-1/2 #326", "5/16-16 x 1-1/2 #434", "3/8-16 x 2\" #361", "7/16-14 x 2\" #379", "1/2-13 x 2-1/2 #396", "1/4-20 x 2\" #328", "5/16-18 x 2\" #345", "3/8-16 x 2-1/2 #363", "7/16-14 x 2-1/2 #381", "1/2-13 x 3\" #397", "m3 x 6 #6830", "m3 x 8 #6831", "m3 x 10 #6832", "m3 x 12 #6833", "m3 nuts", "m4 x 8 #5166", "m4 x10 #5167", "m4 x 12 #5168", "m4 x 16 #5169", "m4 nuts #4774", "m5 x 10 #5176", "m5 x 12 #5177", "m5 x 16 #5178", "m5 x 20 #5179", "m5 nuts #4775", "m6 x 12 #5188", "m6 x 16 #5189", "m6 x 20 #5190", "m6 x 25 #5191", "m6 nuts #4776", "4-40 nuts #2642", "6-32 nuts #2643", "8-32 nuts #2644", "10-24 nuts #2645", "1/4-20 nuts #2648", "4-40 x 1/4 #7596", "6-32 x 1/4 #7601", "8-32 x 3/8 #1497", "10-24 x 1/2 #1508", "1/4-20 x 1/2 #1530", "4-40 x 3/8 #7597", "6-32 x 3/8 #1487", "8-32 x 1/2 #1498", "10-24 x 3/4 #1510", "1/4-20 x 3/4 #1532", "4-40 x 1/2 #7598", "6-32 x 1/2 #1488", "8-32 x 3/4 #1500", "10-24 x 1\" #1511", "1/4-20 x 1\" #1533", "4-40 x 3/4 #7600", "6-32 3/4 #1490", "8-32 x 1\" #1501", "10-24 x 1-1/2 #1513", "1/4-20 x 1-1/2 #1535", "4 x 1/4 #7370", "6 x 3/8 #2472", "8 x 1/2 #2481", "10 x 1/2 #2491", "12 x 1/2 #2501", "14 x 3/4 #2510", "4 x 3/8 #2469", "6 x 1/2 #2473", "8 x 3/4 #2483", "10 x 3/4 #2493", "12 x 3/4 #2503", "14 x 1\" #2511", "4 x 1/2 #2470", "6 x 3/4 #2475", "8 x 1\" #2484", "10 x 1\" #2494", "12 x 1\" #2504", "14 x 1-1/2 #2513", "4 x 3/4 #2471", "6 x 1\" #2476", "8 x 1-1/2 #2486", "10 x 1-1/2 #2496", "12 x 1-1/2 #2506", "14 x 2\" #2514", "1 3/16\" wrench", "vice crank lever", "22mm wrench", "13&16mm wrench", "key? (not for drill press)", "55-62 spanner wrench", "1/2\" allen wrench (aka hex key)", "0.05\"-5/16\" allen key set", "thing with 2 prongs and a big hole", "small rod with teeth in the middle", "8mm/10mm wrench", "7/32\"allen key", "thing with a hex end and hole in top", "magnefix clamp", "3/8\" drill chuck", "1/2\" drill chuck", "collet holder", "3/8\" collet", "1/8\" collet", "1/4\" collet", "3/16\" collet", "edge finder", "3/16\" 2fl hss flat end mill", "5/16\" 4fl hss flat end mill", "1/4\" 4fl hss flat end mill", "0.375\" 3fl hss flat end mill", "1/8\" 2fl hss ball end mill", "1/4\" 2fl 90deg hss end mill", "3/8\" 2fl 90deg hss end mill", "1/2\" 2fl 90deg hss end mill", "3/16\" allen key", "1/2\" tall parallel set", "5/8\" tall parallel set", "3/4\" tall parallel set", "7/8\" tall parallel set", "1\" tall parallel set", "1-1/8\" tall parallel set", "1-1/4\" tall parallel set", "1-3/8\" tall parallel set", "1-1/2\" tall parallel set", "1-5/8\" tall parallel set", "surface plate", "height gauge", "2fl 1/2\" hss flat end mill", "2fl 1/4\" hss flat end mill", "2fl 1/8\" hss flat end mill", "dial indicator", "indicator arm", "edge + zero finder", "\"harvey tool\" tool catalogue", "semi-circle half of vice", "90deg spot drill", "1/4\" drill chuck", "1/64-1/4\" drill chuck", "fixture set", "1/16\" collet", "3/32 collet", "1/8\" collet", "5/32\" collet", "7/32 collet", "1/4\" collet", "9/32\" collet", "5/16\" collet", "11/32\" collet", "3/8\" collet", "13/32\" collet", "7/16\" collet", "15/32\" collet", "centering indicator", "touch tool", "2fl hss flat endmill 5/32 & 3/8", "2fl hss flat endmill 1/4 & 3/8", "2fl hss flat endmill 1/8 & 3/8", "2fl hss flat endmill 5/16 & 3/8", "2fl hss flat endmill 5/16", "2fl hss flat endmill 3/16 & 3/8", "4fl hss flat endmill 3/8 & 3/8", "4fl hss flat endmill 5/32 & 5/32", "4fl hss flat endmill 5/16 & 5/16", "4fl hss flat endmill 3/16 & 3/16", "4fl hss flat endmill 3/8", "utility (paint?) brush", "1/2\" edge finder", "0.2\" edge finder", "stepper controller", "11cm funnel", "touch tool", "tormach drill bit set, 1/16\"-1/2\"", "threaded steel boxes (?)", "valve inserts", "compressor muffler", "multicolored bowls", "plastic 5qt measuring cup", "plastic containers w/ lids", "cardboard vr set", "diy cardboard vr kit", "beverage dispenser & stand", "white tablecloth", "trays", "plastic bowls", "presto electric skillet", "foam helmet", "3d print & laser cut molds", "soap", "dried flowers", "ktdorns colorant set", "artisan oil", "plastic molds", "rice", "baking soda", "corn starch", "soy wax", "white bees wax pellets", "decorative cloth", "pcb jewelry making", "measuring cups", "funnel", "spoons", "coconut oil", "citric acid", "white shirts", "lego robot arms", "fog machine", "storage tube", "giant post-its", "foam puzzle pieces", "post-it wall stick pad", "raspberry pi 7\" touchscreen display", "raspberry pi kits", "raspberry pi boards", "sd cards", "micro usb power supply", "frames", "color coding labels", "pushpins", "vinly", "paintbrush", "squeegee", "screen printing ink", "canvas bags", "origami paper", "small embroidery hoops", "large embroidery hoops", "foam boards (11\"x14\")", "heat transfer vinyl sheets", "mat cardboard", "cardboard (10.5\"x16.5\")", "vellum paper (8.5\"x11\")", "halloween iron on stickers", "adult coloring book", "printer paper (white)", "multicoloured astrobrights paper", "grey foam sheets (9\"x12\")", "multicoloured construction paper (9\"x12\")", "astrobrights paper", "multicoloured foam sheets (9\"x12\")", "large note cards", "pack of 100 ruled index cards", "acrylic paint (2 fl oz)", "sargent art acrylic paint (16oz)", "craft smart washable paint (4 fl oz)", "liquitex matte varnish", "golden satin glazing liquid", "slick dimensional fabric paint", "misc small paint bottles", "king size sharpies", "fine point sharpie pack (12 count)", "black white board markers", "bic round stick pen pack (60 count)", "scotch double-sided tape (3 rolls)", "scotch general masking tape", "post-it note pack (24 pads)", "mini post-it note pads", "mini paint roller", "paint roller cover", "1/2\" paintbrushe", "1\" paintbrush", "1 1/2\" paintbrush", "2\" paintbrush", "3\" paintbrush", "miscellaneous paintbrushes", "powder brush", "fine point sharpie pack (12 count)", "multicoloured bic fine point markers (12 count)", "multicoloured bic fine point markers (loose)", "silver fine point sharpie", "black fine point sharpie", "multicoloured coloured pencils (loose)", "martol 2b drawing pencils", "arteza #2 hb pencils (12 count)", "papermate #2 pencil pack (72 count)", "mini christmas bells", "black plastic wire", "american crafts ribbon (375\" x 4')", "gold leaf ribbon", "berwick purple curling ribbon", "christmas themed curling ribbon", "christmas themed ribbon", "multicoloured vellum paper", "multicoloured straws", "popsicle sticks", "cloth pins", "wooden dowels", "regency naturals cooking twine", "creativity street wood craft stick pack (150 count)", "neenah white cardstock", "poster stand", "multicoloured dot stickers (varying sizes)", "name badge labels", "foil star labels (440 count)", "sticko number stickers (390 count)", "sticko number stickers (loose)", "halloween paper pad (6\"x6\")", "glitter set (6 count)", "shimmer powder set (12 count)", "dribble drabble mica powder color shake jars (24 count)", "mixed sequins (9 count)", "non-toxic glitter (2 oz)", "138 polyester bonded black thread (1 lb)", "#69 nylon grey thread (1 oz)", "polyester white thread (500 yards)", "white twine", "cotton rounds (80 count)", "fabric circles (varying shapes)", "multicoloured pipe cleaners", "all purpose school glue (30 count)", "scotch blue painters tape", "rubber band bags", "pin-pong balls", "creativity street popsicle stick packs (1000 count)", "business card holder", "delta ceramcoat textile medium (8 fl oz)", "liquitex matte fluid medium (8.79 fl oz)", "apple barrel quick drying matte acrylic paint (2 fl oz)", "multicouloured tulip slick fabric paint", "jeff & connie workshop maker educator badges", "nyu sunglasses", "9v batteries (12 count)", "trimmer potentiometer", "nondescript tabeltop game pawns", "toy pirate coins", "autumn sinage", "sculpey bakeable adhesive (2 fl oz)", "waterworks tool & part cleaner", "zyvax nano release", "zyvax sealer sf", "fastcast urethane casting resin", "ping-pong balls", "mod podge waterbase sealer, glue, & finish (32 fl oz)", "legos", "lebeautouche plasteline (2 lbs)", "ecoflex platinum cure silicone rubber part a", "ecoflex platinum cure silicone rubber part b", "jenga", "littlebits extended kit", "plastilina non-hardening modeling clay (5 lbs)", "measuring cup (24 oz)", "clay modeling tools", "digitalvoice recorder", "spare wheel attachments", "c-line name badge holder kit (50 count)", "laser cut birch puzzle pieces", "name tag necklace", "fabric black makerspace sign", "nonedescript black plates", "miscellaneous paper signs", "acrylic 12\" x 24\" x 1/8\"", "birch wood 12\" x 12\" x 1/8\"", "\"dog tags", "1.96\"\" x 1.13\"\" x 0.5\"\"\"", "\"luggage tags", "3.875\"\" x 2\"\" x 0.6\"\"\"", "\"machinable wax", "3.5\"\" x 3\"\" x 1.5\"\"\"", "\"pcb blank fr-1, double sided", "4\"\" x 5\"\" x 1.6mm\"", "\"pcb blank fr-1, single sided", "4\"\" x 5\"\" x 1.6mm\"", "\"pcb blank fr-4 1/2oz, double sided", "9\"\" x 12\"\" x 0.28\"\"\"", "\"petg plastic sheets", "12\"\" x 12\"\" x 0.2\"\"\"", "\"proconduct paste packet", "2.5g\"", "\"sanding sheet, various grits", "9\"\" x 11\"\"\"", "\"vinyl sheet", "12\"\" x 30\"\"\"", "gloves", "glue (large bottle)", "brown paper trays", "tongs", "pens", "pencils", "sharpies", "markers", "notecards", "post-it notes", "rubber bands", "popsicle sticks", "colored construction paper", "white twine", "colored ribbon (mini rolls)", "dot sticker rolls", "pipe cleaners", "yarn (large roll)", "tiny white cups for glue", "colored ribbon (medium rolls)", "extra raspberry pi", "glitter and shimmer, mica powder, sequins", "modeling clay", "utensils", "napkins", "parchment paper", "cups", "lanyards and badges and labels", "cooling fan", "funnels", "clean hands hand sanitizer", "medi curad alcohol wipes", "3m spray", "goof off miracle remover", "fast drying polyurethane", "contact cement", "spray adhesive", "wood filler", "blow torch part", "turkish labeled liquids", "mineral oil", "acetone", "spray starch plus", "99% isopropyl alcohol", "tormach waylube oil", "gorilla glue spray", "70% isopropyl alcohol", "colormaster primer", "mold release agent", "tormach coolant", "lubricator spray", "mold release agent & dry film lubricant", "epoxy resin", "gas lighter refill", "vegetable glycerin", "klean strip acetone", "mclube chemical (idk)", "vacuum pump oil", "plasti dip", "flat gray primer", "spar urethane", "all purpose household spray paint", "fiberglass resin", "killz latex", "lithium greaser", "multipurpose spray adhesive", "\"0.1 uf, 50v", "electrolytic capacitor\"", "\"1 uf, 50v", "electrolytic capacitor\"", "\"2.2 uf, 35v", "electrolytic capacitor\"", "\"3.3 uf, 35v", "electrolytic capacitor\"", "\"4.7 uf, 35v", "electrolytic capacitor\"", "\"10 uf, 35v", "electrolytic capacitor\"", "\"22 uf, 50v", "electrolytic capacitor\"", "\"33 uf, 35v", "electrolytic capacitor\"", "replacement evf100 filter", "solder spool holder", "\"adjustable board cradle", "model abc-tq\"", "\"convenction pre-heating", "system with temp control\"", "\"precision fluid dispensing", "with digital pulse timer", "and adjustable air pressure\"", "blue bags", "cardboard", "heat sheilds", "\"fr4-boards", "kapton\"", "scrap pcb?", "\"330 uf, 25v", "electrolytic capacitor\"", "\"100 uf, 16v", "electrolytic capacitor\"", "\"220 uf, 10v", "electrolytic capacitor\"", "\"47 uf, 35v", "electrolytic capacitor\"", "\"470 uf, 16v", "electrolytic capacitor\"", "\"bk precision", "150w dc electronic load\"", "\"lm555cn", "ic timer\"", "\"tip120gos-nd", "transistor npn darl", "60v 5a\"", "\"nand gate ic", "2 channel - 14-pdip\"", "\"uln2003apg", "7-ch darlington sink driver\"", "atmega16a-pu", "atmega8a-pu", "\"tlc272ip", "op-amp\"", "\"l293d", "burshed dc motor driver\"", "atmega328p-pu", "\"irf630npbf-nd", "mosfet n-ch", "200v 9.3a\"", "\"lm311nns/nopb-nd", "ic voltage comparator", "8-dip\"", "\"ne555p", "timer ic\"", "\"irf630", "mosfet n-ch", "200v 9a\"", "tap copper foil", "fume extractor filters", "work station cover", "\"10000 uf, 6.3v", "electrolytic capacitor\"", "botron's b9844 snap tool", "\"techni-stat", "push and clinch and snap", "male stud\"", "\"techni-stat", "push and clinch and snap", "female stud\"", "\"techni-stat 10mm", "snap ground", "male\"", "solder paste syringe", "anti static wrist strap", "anti static bags", "aa battery holders", "9v battery holder", "multi-color led strip", "\"prototyping pcb", "(green boards)\"", "solder", "tweezers", "sponges", "soldering tips", "solder suckers", "solder wick", "tip tinner", "male to female header pins", "male to male header pins", "ic sockets", "makerspace pcb", "makerspace pcb part bin", "switches", "terminal blocks", "nozteck bag (tips)", "flux pen", "\"transistor npn (pn2222abu)", "40v 1a", "to-92 case\"", "\"transistor npn (pn2907abu)", "60v 0.8a", "to-92\"", "\"transistor npn (pn2222ata)", "40v 1a", "to-92\"", "atmega328p-pu", "\"lm1117mpx-5.0/nopb", "ic reg linear", "5v 800 ma\"", "\"mic5205-3.3ym5-tr", "ic reg linear", "3.3v 150 ma\"", "\"conn usb micro b", "smt\"", "\"ne555p", "timer ic\"", "flux paste", "conductivity solution", "misc ic", "expoxyglas", "heat sheilds", "no clean flux", "brushes", "solder pump", "alcohol bottle containters", "lpfk equipment/parts", "lpkf pro conduct kit", "27 ohm resistor (extra)", "coin selector", "\"cover and dividers", "for black bins\"", "anti-static cleaner", "lpkf cleaner", "potentiometer (kit)", "dip switche", "ir led", "potentiometer", "5v linear regulator", "limit switches", "to-220 heatsinks", "screw terminals", "12 mhz crystal oscillitors", "potentiometer", "resistors (various ohms)", "header pins (variety)", "\"disc elements", "with 6\"\" leads\"", "\"prototyping pcb", "(green boards)\"", "big switch", "jst cables", "slide potentiometer", "diodes", "relay switches", "coin cell battery holder", "force sensative resistor", "led (different colors)", "jst connector maker kit", "jumper wire maker kit", "general pnp transistor", "general npn transistor", "spdt switch", "12v zener diode", "5.1v zener diode", "general diode", "green led", "red led", "yellow led", "blue led", "white led", "mosfet", "crystal oscillator", "ferrite bead", "female header pins", "opamp", "npn darlington transistor", "male header pins", "coin cell battery", "pushbutton switch", "1k trim potentiometer", "protoboard", "proconduct paste packet", "sv2 conductive ink", "solder paste", "solder paste syringes", "\"18 awg stranded", "white wire\"", "\"22 awg solid strand", "green wire\"", "\"22 awg solid strand", "black wire\"", "\"22 awg solid strand", "red wire\"", "\"22 awg solid strand", "purple wire\"", "\"14/19 awg stranded", "white wire\"", "\"14/19 awg stranded", "white wire\"", "\"14/19 awg stranded", "white wire\"", "\"14/19 awg stranded", "black wire\"", "\"16 gauge stranded conductive", "white speaker wire\"", "\"10 pf, 50v", "ceramic capacitor\"", "\"47 pf, 50v", "ceramic capacitor\"", "\"100 pf, 50v", "ceramic capacitor\"", "\"470 pf, 50v", "ceramic capacitor\"", "\"1000 pf, 50v", "ceramic capacitor\"", "\"4700 pf, 50v", "ceramic capacitor\"", "\"0.1 uf, 50v", "ceramic capacitor\"", "\"330 uf, 25v", "electrolytic capacitor\"", "\"220 uf, 10v", "electrolytic capacitor\"", "\"100 uf, 16v", "electrolytic capacitor\"", "\"47 uf, 35v", "electrolytic capacitor\"", "\"33 uf, 35v", "electrolytic capacitor\"", "\"22 uf, 50v", "electrolytic capacitor\"", "\"10 uf, 55v", "electrolytic capacitor\"", "\"4.7 uf, 35v", "electrolytic capacitor\"", "\"470 uf, 16v", "electrolytic capacitor\"", "\"1000 uf, 16v", "electrolytic capacitor\"", "\"1 ohm precision", "resistor\"", "\"3.3 uf, 35v", "electrolytic capacitor\"", "\"2.2 uf, 35v", "electrolytic capacitor\"", "\"1 uf, 50v", "electrolytic capacitor\"", "\"0.1 uf, 50v", "electrolytic capacitor\"", "misc resistors", "misc resistors", "1.0 ohm resistor", "10.0 ohms resistor", "12.0 ohms resistor", "15.0 ohms resistor", "18.0 ohms resistor", "22.0 ohms resistor", "27.0 ohms resistor", "33.0 ohms resistor", "39.0 ohms resistor", "47.0 ohms resistor", "56.0 ohms resistor", "68.0 ohms resistor", "82.0 ohms resistor", "100.0 ohms resistor", "120.0 ohms resistor", "150.0 ohms resistor", "180.0 ohms resistor", "220.0 ohms resistor", "270.0 ohms resistor", "330.0 ohms resistor", "390.0 ohms resistor", "470.0 ohms resistor", "560.0 ohms resistor", "680.0 ohms resistor", "820.0 ohms resistor", "1000.0 ohms resistor", "1200.0 ohms resistor", "1500.0 ohms resistor", "1800.0 ohms resistor", "2200.0 ohms resistor", "2700.0 ohms resistor", "3300.0 ohms resistor", "3900.0 ohms resistor", "4700.0 ohms resistor", "5600.0 ohms resistor", "6800.0 ohms resistor", "8200.0 ohms resistor", "10000.0 ohms resistor", "12000.0 ohms resistor", "15000.0 ohms resistor", "18000.0 ohms resistor", "22000.0 ohms resistor", "27000.0 ohms resistor", "33000.0 ohms resistor", "39000.0 ohms resistor", "47000.0 ohms resistor", "56000.0 ohms resistor", "68000.0 ohms resistor", "82000.0 ohms resistor", "100000.0 ohms resistor", "120000.0 ohms resistor", "150000.0 ohms resistor", "180000.0 ohms resistor", "220000.0 ohms resistor", "270000.0 ohms resistor", "330000.0 ohms resistor", "390000.0 ohms resistor", "470000.0 ohms resistor", "560000.0 ohms resistor", "680000.0 ohms resistor", "820000.0 ohms resistor", "1000000.0 ohms resistor", "clear", "hi-temp", "elastic", "flexable", "dental", "white", "form 3 resin tank v2.1", "mojo support", "mojo color material", "mojo black material", "mojo ivory material", "model cleaning fluid", "support cleaning fluid", "\"veroclear", "rgd810\"", "\"support", "sup705\"", "cleaning cloths", "waste container", "transparency paper", "scraper", "mirror", "\"multi-purpose", "router table switch\"", "\"4 flute hss", "3/4 x 3/4", "end mill\"", "\"4 flute hss", "11/16 x 5/8", "end mill\"", "\"4 flute hss", "5/8 x 5/8", "end mill\"", "\"4 flute hss", "9/16 x 1/2", "end mill\"", "\"4 flute hss", "1/2 x 1/2", "end mill\"", "\"4 flute hss", "7/16 x 3/8", "end mill\"", "\"4 flute hss", "3/8 x 3/8", "end mill\"", "\"4 flute hss", "5/16 x 3/8", "end mill\"", "\"4 flute hss", "1/4 x 3/8", "end mill\"", "\"4 flute hss", "3/16 x 3/8", "end mill\"", "\"2 flute hss", "3/4 x 3/4", "end mill\"", "\"2 flute hss", "11/16 x 5/8", "end mill\"", "\"2 flute hss", "5/8 x 5/8", "end mill\"", "\"2 flute hss", "9/16 x 1/2", "end mill\"", "\"2 flute hss", "1/2 x 1/2", "end mill\"", "\"2 flute hss", "7/16 x 3/8", "end mill\"", "\"2 flute hss", "3/8 x 3/8", "end mill\"", "\"2 flute hss", "5/16 x 3/8", "end mill\"", "\"2 flute hss", "1/4 x 3/8", "end mill\"", "\"2 flute hss", "3/16 x 3/8", "end mill\"", "1/8\" collet", "3/16\" collet", "1/4\" collet", "5/16\" collet", "3/8\" collet", "7/16\" collet", "1/2\" collet", "9/16\" collet", "5/8\" collet", "11/16\" collet", "3/4\" collet", "13/16\" collet", "7/8\" collet", "drill chuck", "facing tool"];
    var temp = {}
    for(let i in close_text){
      if(temp[close_text[i][0]]){
        temp[close_text[i][0]].push(close_text[i])

      }else{
        temp[close_text[i][0]] = []
        temp[close_text[i][0]].push(close_text[i])
      }
    }
    setWordDB(temp)
  }

  useEffect(() => {
    var temp = []
    for (let i in states) {
      if (states[i]) {
        for (let j = 0; j < inventory.length; j++) {
          if (inventory[j].cat == i) {
            temp.push(inventory[j])
          }
        }
      }
    }
    setItemRender(temp)
    if (temp.length == 0) { setChecked(false) }
  }, [states])

  useEffect(() => {
    if(query.length == 0){
      setShowSearchResults(false);
    }else{
      if(ai_mode == false){
        var query_text = query.toLowerCase()
        var close_text = worddb[query_text.charAt(0)]
        console.log(close_text)
        console.log(closestMatch(query_text, close_text, true))
        setSuggestions(closestMatch(query_text, close_text, true))
      }
      if(ai_mode == true){
        var query_text = query.toLowerCase()
        close_text = ["help me build rc plane","what is arduino","what is maker space","where is makerspace","who to contact"]
        setSuggestions(close_text)
      }
    }
    // if(query.charAt(0))
    // console.log(closestMatch(query, close_text, true));
  },[query])


  function store_to_session_storage() {
    if (!sessionStorage.getItem("inventory")) {
      get_all_inventory()
    }
    else {
      setInventory(JSON.parse(sessionStorage.getItem("inventory")))
    }
  }

  async function get_all_inventory() {
    try {
      const response = await axios.get('https://o9qzyqdqsf.execute-api.us-west-2.amazonaws.com/items');
      const current_inventory_items = JSON.stringify(response.data.Items)
      setInventory(JSON.parse(current_inventory_items))
      window.sessionStorage.setItem("inventory", current_inventory_items);
      console.log("making api call")
    } catch (error) {
      console.error(error);
    }
  }

  function checkbox_state(event, name) {
    setChecked(true)
    const updatedStates = {
      ...states,
      [name]: event.target.checked
    }
    setCheckState(updatedStates);
  }

  function search(){
    var search_results = [];

    if(ai_mode == false){
      if(!inventory){
        console.log("no inventory found")
        setShowSearchResults(false)
      }; 

      for(let i = 0; i<inventory.length;i++){
        if(inventory[i].item_name.toLowerCase() == query.toLowerCase()){
          search_results.push(inventory[i]); 
        }
      }

      if(search_results != []){

        setRenderResults(search_results);
        setShowSearchResults(true);
        setSearchMessage(`Items found:${search_results.length}`)
        }else{
          setSearchMessage("No Item found");
        }
    }


    if(ai_mode == true){
      var system_= `Your name is Makerbot and you part of the NYU makerspace team and you are a bot that helps people turn their enginering imagination to reality. About makerspace, location: "NYU MakerSpace 6 MetroTech Center Brooklyn, NY, 11201", contact info: Phone: (646)-997-3058, Email: tandon-makerspace@nyu.edu, working hours: Monday - Friday: 10AM - 10PM, Saturday - Sunday: 12PM - 6PM
      What is MakerSpace?
      The NYU Tandon MakerSpace is a workspace lab created to foster collaborative design projects. Space is open to all NYU students, staff, and faculty. It highlights new kinds of iterative, interdisciplinary teamwork using cutting-edge tools of rapid prototyping and digitally driven production.
      
      How do you get started in the MakerSpace?
      1. Can I use the MakerSpace?
      If you are a current NYU student, staff, or faculty, in any school or program: Yes!
      2. Attend a Safety Orientation
      Click Training and Reservations on our menu and start with the Safety Orientation button. You will be walked through a series of steps to start the Safety Orientation which consists of a tour of the space, safety procedures, and the Ultimaker 3D printer training to begin using the space!
      3. Start Making!
      The MakerSpace can be used for classwork, hobbies, or just for fun. Use the Machines link at the top of the page to find out more about what is available, and ask our staff for help choosing the best tool for the job. Then, watch the necessary videos and sign up for any bookings you may need to complete your desired trainings.
      Users are now required to create a reservation for all your MakerSpace needs, including tables, machines, and trainings. Check out our Training and Reservations page to learn more.
      4. Participate
      The MakerSpace is more than a work space, it's a community. Get to know who else is working here for even more expertise. The Design Lab hosts events and workshops throughout the year for learning, networking, and fun! For the Spring 2021 semester, all of the Design Lab's workshops will be remote. Check the Events page to see what's coming up.
      
      with this information, your task is to help NYU students with their project ideas or any in general technical doubts. if you do not know the anwers just give them maker space contact info.       
      `
      const options = {
      method: 'POST',
      url: 'https://api.openai.com/v1/chat/completions',
      headers: {
        Authorization: 'Bearer '+ api,
        'Content-Type': 'application/json'
      },
      data: {
        model: 'gpt-3.5-turbo',
        messages: [{role: 'system', content: system_},{role:'user',content:query}], 
        max_tokens: 527+200
      }
    };
    

    axios.request(options).then(function (response) {
      console.log(response)
      console.log(response.data.choices[0].message.content);
      setAIResults(response.data.choices[0].message.content)
    }).catch(function (error) {
      console.error(error);
    });

    }
  }

  function search_mode(){
    if(ai_mode){
      setAIMode(false)
      setAIModeIndicator("OFF")
    }else{
      setAIMode(true)
      setAIModeIndicator("ON")
    }
  }


  return (
    <>
      <div class="flex flex-col justify-between items-center bg-blac h-screen" >
        <div class="w-full h-screen">

          <div class="flex flex-row items-center">
            <div class="p-2 hidden sm:block">
              <Image
                src="/logo.png"
                alt="NYU maker space"
                width={300}
                height={300}
              />
            </div>
            <div class="flex flex-row items-center p-2 w-full justify-center">
              <div class="relative w-full">
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input type="search" class=" block w-full right-2.5 bottom-2.5 p-2 pl-10 text-sm text-gray-900 rounded-lg " placeholder="Search Items, Sensors..." value={query} onChange={(event) => setQuery(event.target.value)} required></input>
                </div>
              <div class="flex p-2"><button class="text-white  bg-[#58048c] hover:bg-[#350254] font-medium rounded-lg text-sm px-4 py-2" type='submit' onClick={search}>Search</button></div>
              <div class="flex p-2"><button class="text-white  bg-[#58048c] hover:bg-[#350254] font-medium rounded-lg text-sm px-4 py-2" type='submit' onClick={search_mode}>AI:{ai_mode_indicator}</button></div>
            </div>
          </div>

          <hr></hr>
          {/* bg-slate-500 */}
          <div class="flex flex-row min-h-full">
            <div class="w-1/4  bg-white text-[#58048c]">
              <div class="flex flex-col p-4">
                <div>
                  <input id="Front Desk Closet" type="checkbox" onChange={(event) => checkbox_state(event, "Front Desk/Closet")} ></input>
                  <label class="ml-2 " for="Front Desk Closet">Front Desk Closet</label>
                </div>
                <div>
                  <input id="Tools" type="checkbox" onChange={(event) => checkbox_state(event, "Tools")}></input>
                  <label class="ml-2 " for="Tools">Tools</label>
                </div>
                <div>
                  <input id="BoltDepot + Tormach Mill" type="checkbox" onChange={(event) => checkbox_state(event, "BoltDepot + Tormach Mill")}></input>
                  <label class="ml-2 " for="BoltDepot + Tormach Mill">BoltDepot + Tormach Mill</label>
                </div>
                <div>
                  <input id="Design Lab" type="checkbox" onChange={(event) => checkbox_state(event, "Design Lab")}></input>
                  <label class="ml-2 " for="Design Lab">Design Lab</label>
                </div>
                <div>
                  <input id="Workshop" type="checkbox" onChange={(event) => checkbox_state(event, "Workshop")}></input>
                  <label class="ml-2 " for="Workshop">Workshop</label>
                </div>
                <div>
                  <input id="Retail/Prototyping" type="checkbox" onChange={(event) => checkbox_state(event, "Retail/Prototyping")}></input>
                  <label class="ml-2 " for="Retail/Prototyping">Retail/Prototyping</label>
                </div>
                <div>
                  <input id="Fire Cabinet" type="checkbox" onChange={(event) => checkbox_state(event, "Fire Cabinet")}></input>
                  <label class="ml-2 " for="Fire Cabinet">Fire Cabinet</label>
                </div>
                <div>
                  <input id="Electrical Benches" type="checkbox" onChange={(event) => checkbox_state(event, "Electrical Benches")}></input>
                  <label class="ml-2 " for="Electrical Benches">Electrical Benches</label>
                </div>
                <div>
                  <input id="Form3" type="checkbox" onChange={(event) => checkbox_state(event, "Form3")}></input>
                  <label class="ml-2 " for="Form3">Form3</label>
                </div>
                <div>
                  <input id="Mojos" type="checkbox" onChange={(event) => checkbox_state(event, "Mojos")}></input>
                  <label class="ml-2 " for="Mojos">Mojos</label>
                </div>
                <div>
                  <input id="Objet30" type="checkbox" onChange={(event) => checkbox_state(event, "Objet30")}></input>
                  <label class="ml-2 " for="Objet30">Objet30</label>
                </div>
                <div>
                  <input id="Drill mill" type="checkbox" onChange={(event) => checkbox_state(event, "Drill mill")}></input>
                  <label class="ml-2 " for="Drill mill">Drill mill</label>
                </div>
              </div>
            </div>
            <div class="w-full bg-slate-100">
            {query && <div className="flex px-8 py-4">Suggested: {suggestions.map((item) => (
                    <div className="text-[#58048c] px-2" >{item}</div>
                  ))}</div>}
              {ai_mode && airesults  && 
              <div class="flex flex-col  justify-end  px-8 py-4 rounded-lg drop-shadow-md bg-white border-2 border-b-[#bfbaba] hover:bg-[#f7f6f6] ">
                <div className="text-sm text-[#58048c]">{airesults}</div>
                </div>}
              {show_search_results && <h2 class="px-8 py-4">{search_message}</h2>}
              {show_search_results && <Results item_render={search_results_render}></Results>}
              {checked && items_render && <h2 class="px-8 py-4">Found Results:{items_render.length}</h2>}
              {checked && items_render && <Results item_render={items_render}></Results>}
              {!checked && inventory && <h2 class="px-8 py-4">Total Inventory: {inventory.length}</h2>}
              {!checked && inventory && <Results item_render={inventory}></Results>}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}