// @ts-check

import { VisualNovelEngine } from './engine.js';

/**
 * Single source of truth for story-specific state fields.
 * Add new values here when your story needs to remember
 * stats, clues, items, or which conversations already happened.
 */
const storyInitialState = {
  statTime: 0,
  statAngst: 0,
  statStress: 0,
  itemHasNotepad: false,
  itemHasHeadphones: false,
  itemHasPhone: false,
  itemHasShoes: false,
  talkedToAbigail: false,
  talkedToAlex: false,
  talkedToJack: false,
  talkedToJessica: false,
  clueFoundGarden: false,
  clueFoundPhoneMessage: false,
  storyAccusedSomeone: false,
  storyCheckedBackpack: false,
  valg1: false,
  valg2: false,
  er: false,
  ikke: false,
  RoligSidNed: false,
  VentForan: false,
  Billet: false,
  IkkeBillet: false,
  GemmeSig: false,
  TagPlads: false,
  Sidned: false,
  Ståop: false,
  storyEnding: /** @type {'good' | 'bad' | null} */ (null),
};

/**
 * @typedef {typeof storyInitialState} StoryState
 */

/**
 * @typedef {Omit<import('./engine.js').VisualNovelEngine, 'initialState' | 'state' | 'setState' | 'resetState'> & {
 *   initialState: StoryState,
 *   state: StoryState,
 *   setState: (updates?: Partial<StoryState>) => StoryState,
 *   resetState: () => StoryState,
 * }} StoryEngine
 */

/**
 * @typedef {(game: StoryEngine, details: import('./engine.js').EngineActionDetails) => (string | void | null)} StoryAction
 * @typedef {(game: StoryEngine, context: import('./engine.js').EngineConditionContext) => boolean} StoryCondition
 */

// A condition is used by HTML attributes like `data-visible-if`.
// Return `true` when an element should be visible, and `false` when it should be hidden.
/** @type {Record<string, StoryCondition>} */
const storyConditions = {
  /**
   * @param {StoryEngine} game
   * @returns {boolean}
   */
  shouldShowPhone(game) {
    return !game.state.clueFoundPhoneMessage;
  },

  /**
   * @param {StoryEngine} game
   * @returns {boolean}
   */
  shouldShowMug(game) {
    return !game.state.clueFoundGarden;
  },

  /**
   * @param {StoryEngine} game
   * @returns {boolean}
   */
  shouldShowBackpack(game) {
    return !game.state.storyCheckedBackpack;
  },

  /**
   * @param {StoryEngine} game
   * @returns {boolean}
   */
  shouldShowHeadphones(game) {
    return !game.state.itemHasHeadphones;
  },

  /**
   * @param {StoryEngine} game
   * @returns {boolean}
   */
  shouldShowShoes(game) {
    return !game.state.itemHasShoes;
  },

  /**
   * @param {StoryEngine} game
   * @returns {boolean}
   */
  shouldShowNotepad(game) {
    return !game.state.itemHasNotepad;
  },

  /**
   * @param {StoryEngine} game
   * @returns {boolean}
   */
  canLeaveLivingRoom(game) {
    return game.state.clueFoundGarden || game.state.statFocus >= 2;
  },

  /**
   * @param {StoryEngine} game
   * @returns {boolean}
   */
  canGoToPark(game) {
    return game.state.talkedToJessica && game.state.itemHasHeadphones;
  },

  /**
   * @param {StoryEngine} game
   * @returns {boolean}
   */
  canOfferSupportChoice(game) {
    return game.state.itemHasNotepad && game.state.statTrust >= 2;
  },

  /**
   * @param {StoryEngine} game
   * @returns {boolean}
   */
  foundPhoneMessage(game) {
    return game.state.clueFoundPhoneMessage;
  },

  /**
   * @param {StoryEngine} game
   * @returns {boolean}
   */
  blamedSomeone(game) {
    return game.state.storyAccusedSomeone;
  },

  /**
   * @param {StoryEngine} game
   * @returns {boolean}
   */
  stayedFocused(game) {
    return game.state.statFocus >= 3;
  },

  /**
   * @param {StoryEngine} game
   * @returns {boolean}
   */
  builtTrust(game) {
    return game.state.statTrust >= 2;
  },
};

// `storyActions` is where you add custom JavaScript for your story.
// Each action is a named function that HTML can call from `data-run="..."`.
// Actions can read `game.state`, save values with `game.setState(...)`,
// update the dialog, play audio, or return a scene id to move somewhere else.
/** @type {Record<string, StoryAction>} */
const storyActions = {
  /**
   * @param {StoryEngine} game
   * @returns {string}
   */
  restartStory(game) {
    game.stopAllAudio();
    game.resetState();
    return 'intro-scene';
  },

  /**
   * @param {StoryEngine} game
   * @returns {void}
   */
  RoligSidNed (game) {
    game.setState({
      statStress: game.state.statStress - 1,
      RoligSidNed: true,
    })
  },
  VentForan (game) {
    game.setState({
      statStress: game.state.statStress + 3,
      VentForan:true,
    })
  },
  harRoligSidNed(game) {
    return game.state.RoligSidNed;
  },

  harVentForan(game) {
    return game.state.VentForan;
  },

  valg1(game) {
    game.setState({
      statTime: game.state.statTime - 5,
      valg1:true,
    });

    return 'valg1-scene';
  },

  valg2(game) {
    game.setState({
      statTime: game.state.statTime - 20,
      valg2:true,
    });

    return 'valg2-scene';
  },
  harValgt1(game) {
    return game.state.valg1;
  },

  harValgt2(game) {
    return game.state.valg2;
  },

  er (game) {
    game.setState({
      statAngst: game.state.statAngst + 1,
      er: true,
    })
  },
  ikke (game) {
    game.setState({
      statAngst: game.state.statAngst + 0,
      ikke:true,
    })
  },
  harEr(game) {
    return game.state.er;
  },

  harikke(game) {
    return game.state.ikke;
  },

  Billet(game) {
    game.setState({
      statAngst: game.state.statAngst - 3,
      Billet:true,
    });

    return 'Billet-scene';
  },

  IkkeBillet(game) {
    game.setState({
      statAngst: game.state.statAngst - 6,
      IkkeBillet:true,
    });

    return 'IkkeBillet-scene';
  },
  harBillet(game) {
    return game.state.Billet;
  },

  harIkkeBillet(game) {
    return game.state.IkkeBillet;
  },

  GemmeSig (game) {
    game.setState({
      statAngst: game.state.statAngst + 4,
      statStress: game.state.statStress + 1,
      GemmeSig: true,
    })
  },
  TagPlads (game) {
    game.setState({
      statAngst: game.state.statAngst + 6,
      statStress: game.state.statStress + 5,
      TagPlads:true,
    })
  },
  harGemmeSig(game) {
    return game.state.GemmeSig;
  },

  harTagPlads(game) {
    return game.state.TagPlads;
  },

  Sidned (game) {
    game.setState({
      statAngst: game.state.statAngst + 5,
      statStress: game.state.statStress + 1,
      Sidned: true,
    })
  },
  Ståop (game) {
    game.setState({
      statAngst: game.state.statAngst + 2,
      Ståop:true,
    })
  },
  harSidned(game) {
    return game.state.Sidned;
  },

  harStåop(game) {
    return game.state.Ståop;
  },

  /**
   * @param {StoryEngine} game
   * @returns {void}
   */

  /**
   * @param {StoryEngine} game
   * @returns {void}
   */
  startRoomSearch(game) {
    game.setState({
      statFocus: game.state.statFocus + 1,
    });
  },

  /**
   * @param {StoryEngine} game
   * @returns {void}
   */
  talkToAbigail(game) {
    game.setState({
      talkedToAbigail: true,
    });

    if (game.state.statTime < 0) {
      game.setDialog(
        'Dig',
        'Hvad skal jeg vælge?.',
        '#79b8f9',
      );
      return;
    }

    game.setDialog(
      'Abigail',
      'Jeg havde notesbogen på bordet, lige før vi ryddede op. Alt det vigtige er skrevet derinde.',
      '#79b8f9',
    );
    game.playSfx('dialog-abigail-notebook');
  },

  /**
   * @param {StoryEngine} game
   * @returns {void}
   */
  talkToAlex(game) {
    game.setState({
      talkedToAlex: true,
    });

    if (game.state.statTrust < 0) {
      game.setDialog(
        'Alex',
        'Hvis vi bruger energien på at pege fingre, mister vi endnu mere tid. Kig efter faktiske spor.',
        '#bdf9ac',
      );
      return;
    }

    game.setDialog(
      'Alex',
      'Lad os tage ét spor ad gangen. Hvis noget virker mærkeligt, er det sikkert vigtigt.',
      '#bdf9ac',
    );
    game.playSfx('dialog-alex-clue');
  },

  /**
   * @param {StoryEngine} game
   * @returns {void}
   */
  /**
   * @param {StoryEngine} game
   * @returns {void}
   */
  inspectBackpack(game) {
    if (game.state.storyCheckedBackpack) {
      game.setDialog(
        'Alex',
        'Du har allerede kigget i tasken. Notesbogen var der ikke.',
        '#bdf9ac',
      );
      return;
    }

    if (game.state.statTime < -5) {
      game.setDialog(
        'Dig',
        'Der kommer et tog på en anden perron om kort tid.' +
        'Det kræver et togskift midtvejs...',
        '#bdf9ac',
      );
    }
    if (game.state.statTime < -20) {
      game.setDialog(
        'Dig',
        'Der ankommer et tog om 20 minutter, jeg vil blive 5-10 minutter forsinket til min jobsamtale.',
        '#bdf9ac',
      );
    }

    game.setDialog(
      'Alex',
      'Det er min taske. Du må gerne kigge, men jeg pakkede først ud, efter Abigail lagde notesbogen på bordet.',
      '#bdf9ac',
    );
  },

  /**
   * @param {StoryEngine} game
   * @returns {void}
   */
  inspectPhone(game) {
    if (game.state.clueFoundPhoneMessage) {
      game.setDialog(
        'Abigail',
        'Det er stadig Jacks telefon. Beskeden på skærmen gør mig ikke mindre nysgerrig.',
        '#79b8f9',
      );
      return;
    }

    game.playSfx('sfx-pickup');
    game.setState({
      itemHasPhone: true,
      clueFoundPhoneMessage: true,
      statFocus: game.state.statFocus + 1,
    });
    game.setDialog(
      'Abigail',
      'Det er Jacks telefon. Der ligger en halvskrevet besked om noget, han skal nå udenfor.',
      '#79b8f9',
    );
  },

  /**
   * @param {StoryEngine} game
   * @returns {void}
   */
  inspectMug(game) {
    if (game.state.clueFoundGarden) {
      game.setDialog(
        'Alex',
        'Jorden på koppen peger stadig mod haven. Det er nok vores bedste spor lige nu.',
        '#bdf9ac',
      );
      return;
    }

    game.playSfx('sfx-pickup');
    game.setState({
      clueFoundGarden: true,
      statFocus: game.state.statFocus + 1,
    });
    game.setDialog(
      'Alex',
      'Der er jord på kanten. Det er mærkeligt, hvis den kun har stået herinde. Vi bør kigge i haven.',
      '#bdf9ac',
    );
  },

  /**
   * @param {StoryEngine} game
   * @returns {string | void}
   */
  goToGarden(game) {
    if (game.state.clueFoundGarden || game.state.statFocus >= 2) {
      return 'garden-scene';
    }

    game.setDialog(
      'Alex',
      'Vi har ikke nok endnu. Kig dig omkring en gang til, før vi løber videre.',
      '#bdf9ac',
    );
  },

  /**
   * @param {StoryEngine} game
   * @returns {void}
   */
  askJessicaAboutJack(game) {
    const isFirstTime = !game.state.talkedToJessica;

    game.setState({
      talkedToJessica: true,
      statFocus: isFirstTime ? game.state.statFocus + 1 : game.state.statFocus,
    });
    game.setDialog(
      'Jessica',
      'Jack stod herude med sine headphones på. Han gik mod parken, som om han prøvede at undgå os.',
      '#8b5cf6',
    );
  },

  /**
   * @param {StoryEngine} game
   * @returns {void}
   */
  challengeJessica(game) {
    game.setState({
      statTrust: game.state.statTrust - 1,
    });
    game.setDialog(
      'Jessica',
      'Jeg ville være sikker, før jeg sagde noget. Jeg prøver faktisk at hjælpe jer.',
      '#8b5cf6',
    );
  },

  /**
   * @param {StoryEngine} game
   * @returns {void}
   */
  thankJessica(game) {
    const isFirstTime = !game.state.talkedToJessica;

    game.setState({
      statTrust: isFirstTime ? game.state.statTrust + 1 : game.state.statTrust,
      talkedToJessica: true,
    });
    game.setDialog(
      'Jessica',
      'Selv tak. Hvis Jack gik mod parken, er det nok der, I finder næste spor.',
      '#8b5cf6',
    );
  },

  /**
   * @param {StoryEngine} game
   * @returns {void}
   */
  inspectHeadphones(game) {
    if (game.state.itemHasHeadphones) {
      game.setDialog(
        'Jessica',
        'Headphonesene er allerede fundet. De gør det ret tydeligt, at Jack har været her.',
        '#8b5cf6',
      );
      return;
    }

    game.playSfx('sfx-pickup');
    game.setState({
      itemHasHeadphones: true,
      statFocus: game.state.statFocus + 1,
    });
    game.setDialog(
      'Jessica',
      'De ligner Jacks. Han har dem altid på, når han bliver stresset.',
      '#8b5cf6',
    );
  },



  /**
   * @param {StoryEngine} game
   * @returns {void}
   */
  inspectShoes(game) {
    if (game.state.itemHasShoes) {
      game.setDialog(
        'Abigail',
        'Skoene er stadig mudrede. Nogen er gået ud og ind flere gange i aften.',
        '#79b8f9',
      );
      return;
    }

    game.playSfx('sfx-pickup');
    game.setState({
      itemHasShoes: true,
    });
    game.setDialog(
      'Abigail',
      'Der er mudder på dem. Nogen har været ude og ind flere gange.',
      '#79b8f9',
    );
  },

  /**
   * @param {StoryEngine} game
   * @returns {string | void}
   */
  goToPark(game) {
    if (game.state.talkedToJessica && game.state.itemHasHeadphones) {
      return 'park-scene';
    }

    game.setDialog(
      'Abigail',
      'Jeg føler stadig, vi mangler noget. Hvorfor skulle Jack gå mod parken?',
      '#79b8f9',
    );
  },

  /**
   * @param {StoryEngine} game
   * @returns {void}
   */
  inspectNotepad(game) {
    if (game.state.itemHasNotepad) {
      game.setDialog(
        'Alex',
        'Notesbogen er allerede fundet. Nu handler det om, hvad vi gør bagefter.',
        '#bdf9ac',
      );
      return;
    }

    game.playSfx('sfx-pickup');
    game.setState({
      itemHasNotepad: true,
    });
    game.setDialog(
      'Abigail',
      'Det meste er ødelagt, men nogle sider kan stadig læses. Måske kan vi stadig redde afleveringen.',
      '#79b8f9',
    );
  },

  /**
   * @param {StoryEngine} game
   * @returns {string | void}
   */
  confrontJack(game) {
    if (!game.state.itemHasNotepad) {
      game.setDialog(
        'Jack',
        'Jeg forklarer det hele, men find notesbogen først. Den blæste ned ved bænken.',
        '#f9bcac',
      );
      return;
    }

    game.setState({
      talkedToJack: true,
      statCourage: game.state.statCourage + 1,
      statTrust: game.state.statTrust - 1,
    });
    return 'street-night-scene';
  },

  /**
   * @param {StoryEngine} game
   * @returns {string | void}
   */
  stayCalmWithJack(game) {
    if (!game.state.itemHasNotepad) {
      game.setDialog(
        'Jack',
        'Jeg mistede den i vinden. Kig ved bænken først, så forklarer jeg resten.',
        '#f9bcac',
      );
      return;
    }

    game.setState({
      talkedToJack: true,
      statFocus: game.state.statFocus + 1,
      statTrust: game.state.statTrust + 1,
    });
    return 'street-night-scene';
  },

  /**
   * @param {StoryEngine} game
   * @returns {string | void}
   */
  accuseJack(game) {
    if (!game.state.itemHasNotepad) {
      game.setDialog(
        'Jack',
        'Skæld mig ud bagefter, men hjælp mig lige med at finde den først.',
        '#f9bcac',
      );
      return;
    }

    game.setState({
      talkedToJack: true,
      storyAccusedSomeone: true,
      statTrust: game.state.statTrust - 2,
    });
    return 'street-night-scene';
  },

  /**
   * @param {StoryEngine} game
   * @returns {string | void}
   */
  supportTheGroup(game) {
    if (!game.state.itemHasNotepad) {
      game.setDialog(
        'Alex',
        'Hvis vi skal samle gruppen, skal vi først samle selve notesbogen op.',
        '#bdf9ac',
      );
      return;
    }

    game.setState({
      talkedToJack: true,
      statTrust: game.state.statTrust + 1,
      statFocus: game.state.statFocus + 1,
    });
    return 'street-night-scene';
  },

  /**
   * @param {StoryEngine} game
   * @returns {string}
   */
  resolveEnding(game) {
    const isGoodEnding =
      game.state.itemHasNotepad &&
      game.state.statTrust >= 2 &&
      game.state.statFocus >= 3;

    game.stopAllAudio();
    game.setState({
      storyEnding: isGoodEnding ? 'good' : 'bad',
    });

    return isGoodEnding ? 'ending-good-scene' : 'ending-bad-scene';
  },

};

VisualNovelEngine.boot({
  // Change this if you want the story to begin in another scene from index.html.
  startSceneId: 'station1-scene',
  initialState: storyInitialState,
  conditions: /** @type {Record<string, import('./engine.js').EngineCondition>} */ (
    storyConditions
  ),
  actions: /** @type {Record<string, import('./engine.js').EngineAction>} */ (
    storyActions
  ),
});
