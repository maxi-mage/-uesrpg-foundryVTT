/**
 * A simple and flexible system for world-building using an arbitrary collection of character and item attributes
 * Author: Atropos
 * Software License: GNU GPLv3
 * Modified by maxi-mage for UESRPG 30/08/2020
 */

// Import Modules
import { UESRPGActor } from "./actor.js";
import { UESRPGItemSheet } from "./item-sheet.js";
import { UESRPGActorSheet } from "./actor-sheet.js";

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

Hooks.once("init", async function() {
  console.log(`Initializing Unofficial Elder Scrolls RPG System`);

  /**
   * Set an initiative formula for the system. This will be updated later.
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d6",
    decimals: 2
  };

  // Define custom Entity classes
  CONFIG.Actor.entityClass = UESRPGActor;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("uesrpg", UESRPGActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("uesrpg", UESRPGItemSheet, { makeDefault: true });

  // Register system settings
  game.settings.register("uesrpg", "macroShorthand", {
    name: "SETTINGS.UESRPGMacroShorthandN",
    hint: "SETTINGS.UESRPGMacroShorthandL",
    scope: "world",
    type: Boolean,
    default: true,
    config: true
  });

  // Register initiative setting.
  game.settings.register("uesrpg", "initFormula", {
    name: "SETTINGS.UESRPGInitFormulaN",
    hint: "SETTINGS.UESRPGInitFormulaL",
    scope: "world",
    type: String,
    default: "1d6",
    config: true,
    onChange: formula => _simpleUpdateInit(formula, true)
  });

  // Retrieve and assign the initiative formula setting.
  const initFormula = game.settings.get("uesrpg", "initFormula");
  _simpleUpdateInit(initFormula);

  /**
   * Update the initiative formula.
   * @param {string} formula - Dice formula to evaluate.
   * @param {boolean} notify - Whether or not to post nofications.
   */
  function _simpleUpdateInit(formula, notify = false) {
    // If the formula is valid, use it.
    try {
      new Roll(formula).roll();
      CONFIG.Combat.initiative.formula = formula;
      if (notify) {
        ui.notifications.notify(game.i18n.localize("UESRPG.NotifyInitFormulaUpdated") + ` ${formula}`);
      }
    }
    // Otherwise, fall back to a d6.
    catch (error) {
      CONFIG.Combat.initiative.formula = "1d6";
      if (notify) {
        ui.notifications.error(game.i18n.localize("UESRPG.NotifyInitFormulaInvalid") + ` ${formula}`);
      }
    }
  }

  /**
   * Slugify a string.
   */
  Handlebars.registerHelper('slugify', function(value) {
    return value.slugify({strict: true});
  });

});
