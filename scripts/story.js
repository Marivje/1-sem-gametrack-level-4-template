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
  itemHasTicket: false,
  ticketVisible: false,
  canGoNext: false,
  øjnkontakt: false,
  ikkeøjnkontakt: false,
  ignoreralt: false,
  valg1: false,
  valg2: false,
  er: false,
  ikke: false,
  RoligSidNed: false,
  VentForan: false,
  Billet: false,
  IkkeBillet: false,
  Sidned: false,
  Ståop: false,
  ingenting:false,
  armtil: false,
  ignorer: false,
  tys: false,
  givpenge: false,
  kommenter: false,
  ja: false,
  nej: false,
  irriteret: false,
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

  shouldShowTicket(game) {
    return !game.state.itemHasTicket;
  },
  canShowTicket(game) {
    return game.state.ticketVisible && !game.state.itemHasTicket;
  },
  canGoNext(game) {
    return game.state.itemHasTicket;
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
  builtAngst(game) {
    return game.state.statAngst <= 5;
  },
  Angstmedium(game) {
    return (game.state.statAngst >= 6 && game.state.statAngst < 8);
  },
  Angst(game) {
    return (game.state.statAngst >= 8 && game.state.statAngst < 19);
  },
  200(game) {
    return game.state.statAngst >= 19;
  },
  builtStress(game) {
    return game.state.statStress <= 5;
  },
  Stressmedium(game) {
    return (game.state.statStress >= 6 && game.state.statStress < 8);
  },
  Stress(game) {
    return (game.state.statStress >= 8 && game.state.statStress < 19);
  },
  100(game) {
    return game.state.statStress >= 19;
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
  startGame(game) {
    game.goTo('station1-scene');
  },
  tilbage(game) {
    game.goTo('intro-scene');
  },
  /**
   * @param {StoryEngine} game
   * @returns {void}
   */

  showticket(game) {
    game.setState({
      ticketVisible: true,
    });

    game.setDialog(
      'Dig',
      'Her kommer billetten.',
      '#ffffff'
    );

    game.playSfx('heartbeat1');
  },

    pickupTicket (game) {
    game.setState({
      itemHasTicket: true,
    });

    game.setDialog(
      'Dig',
      'Godt, her er den.',
    );


  },

  goToTrain(game) {

    if (!game.state.itemHasTicket) {

      game.setState({
        ticketVisible: true,
      });

      game.setDialog(
        'Dig',
        'Jeg skal have en billet først.',
        '#ffaaaa'
      );

      game.playSfx('scary');

      return 'return-scene';
    }

    return 'Billet-scene';
  },

  ticketkontrollør(game) {
    game.setDialog(
      'Dig',
      'F-fuck, hvor er den!?',
      '#ffffff'
    );

    game.playSfx('heartbeat1');

  },

  RoligSidNed(game) {
    game.setState({
      statStress: game.state.statStress - 1,
      RoligSidNed: true,
    })
  },
  VentForan(game) {
    game.setState({
      statStress: game.state.statStress + 3,
      VentForan: true,
    })
  },
  harRoligSidNed(game) {
    return game.state.RoligSidNed;
  },

  harVentForan(game) {
    return game.state.VentForan;
  },
  irriteret(game) {
    game.setState({
      statStress: game.state.statStress - 3,
      irriteret: true,
    })
  },
  harirriteret(game) {
    return game.state.irriteret;
  },
  vent(game) {
    game.setState({
      statStress: game.state.statStress - 5,
      statAngst: game.state.statAngst - 3,
      vent: true,
    })
  },
  harvent(game) {
    return game.state.vent;
  },
  basestats(game) {
    game.setState({
      statStress: game.state.statStress + 3,
      statAngst: game.state.statAngst + 3,
      basestats: true,
    })
  },
  basestatsmere(game) {
    game.setState({
      statStress: game.state.statStress + 5,
      statAngst: game.state.statAngst + 5,
      basestats: true,
    })
  },
  altokay(game) {
    game.setState({
      statStress: game.state.statStress - 3,
      statAngst: game.state.statAngst - 3,
      altokay: true,
    })
    game.setDialog(
      'Dig',
      'Jeg er snart fremme ved endestationen.',
    );
  },
  altikkeokay(game) {
    game.setState({
      statStress: game.state.statStress + 3,
      statAngst: game.state.statAngst + 3,
      altikkeokay: true,
    })
    game.setDialog(
      'Dig',
      'Hvad var det nu jeg skulle i dag? Jeg kan ikke fokusere. Mit hoved gør ondt...',
    );
  },
  haraltokay(game) {
    return game.state.altokay;
  },

  haraltikkeokay(game) {
    return game.state.altikkeokay;
  },

  valg1(game) {
    game.setState({
      statTime: game.state.statTime - 5,
      valg1: true,
    });

    return 'valg1-scene';
  },

  valg2(game) {
    game.setState({
      statTime: game.state.statTime - 20,
      valg2: true,
    });

    return 'valg2-scene';
  },
  harValgt1(game) {
    return game.state.valg1;
  },

  harValgt2(game) {
    return game.state.valg2;
  },

  er(game) {
    game.setState({
      statAngst: game.state.statAngst + 1,
      er: true,
    })
  },
  ikke(game) {
    game.setState({
      statAngst: game.state.statAngst - 1,
      ikke: true,
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
      Billet: true,
    });

    return 'køb-billetscene';
  },

  IkkeBillet(game) {
    game.setState({
      statAngst: game.state.statAngst + 6,
      IkkeBillet: true,
    });

    return 'IkkeBillet-scene';
  },
  harBillet(game) {
    return game.state.Billet;
  },

  harIkkeBillet(game) {
    return game.state.IkkeBillet;
  },

  Sidned(game) {
    game.setState({
      Sidned: true,
    })
  },
  Ståop(game) {
    game.setState({
      statAngst: game.state.statAngst + 1,
      Ståop: true,
    })
  },
  harSidned(game) {
    return game.state.Sidned;
  },

  harStåop(game) {
    return game.state.Ståop;
  },
  kommentar(game) {
    game.setState({
      statAngst: game.state.statAngst + 1,
      statStress: game.state.statStress + 5,
      kommentar: true,
    });

    game.setDialog(
      'Dig',
      'Få dog den unge til at holde mund!',
    );
    game.playSfx('tinnitus1');
  },
  harkommentar(game) {
    return game.state.kommentar;
  },
  spøgr(game) {
    game.setState({
      statAngst: game.state.statAngst - 2,
      statStress: game.state.statStress - 2,
      spøgr: true,
    });

    game.setDialog(
      'Kvindestemme',
      'Vær dog lidt tålmodig!',
      '#D7FF36',
    );
    game.playSfx('tinnitus1');
  },
  harspøgr(game) {
    return game.state.spøgr;
  },
  ok(game) {
    game.setState({
      statAngst: game.state.statAngst + 1,
      statStress: game.state.statStress + 2,
      ok: true,
    });
    game.playSfx('scary');
  },
  harok(game) {
    return game.state.ok;
  },
  skub(game) {
    game.setState({
      statAngst: game.state.statAngst + 4,
      statStress: game.state.statStress + 2,
      skub: true,
    });

    game.setDialog(
      'Kvindestemme',
      'Hov hey!',
      '#D7FF36',
    );
    game.playSfx('heartbeat1');
  },
  harskub(game) {
    return game.state.skub;
  },

  armtil(game) {
    game.setState({
      statAngst: game.state.statAngst + 5,
      statStress: game.state.statStress + 5,
      armtil: true,
    });

    game.setDialog(
      'Dig',
      'Han holder godt fast. Jeg kan ikke få ham til at give slip...',
    );
    game.playSfx('scary');
  },

  ingenting(game) {
    game.setState({
      statAngst: game.state.statAngst + 2,
      statStress: game.state.statStress + 2,
      ingenting: true,
    });

    game.setDialog(
      'Dig',
      'Det gør mere og mere ondt. Alle kigger på mig.',
    );
    game.playSfx('scary');

  },
  hararmtil(game) {
    return game.state.armtil;
  },

  haringenting(game) {
    return game.state.ingenting;
  },
  F(game) {
    game.setState({
      statAngst: game.state.statAngst + 4,
      statStress: game.state.statStress + 4,
      F: true,
    });

    game.setDialog(
      'Dig',
      'Jeg er ligeglad.',
    );
    game.playSfx('scary');
  },
  mandscary(game) {
    game.playSfx('scary');
  },

  løgn(game) {
    game.setState({
      statAngst: game.state.statAngst + 3,
      statStress: game.state.statStress + 2,
      løgn: true,
    });

    game.setDialog(
      'Dig',
      'Jeg har en på min mobil, men jeg har ikke noget net.',
    );
    game.playSfx('jumpscare');

  },
  harløgn(game) {
    return game.state.løgn;
  },

  ignorer (game) {
    game.setState({
      statAngst: game.state.statAngst + 1,
      ignorer: true,
    });

    game.setDialog(
      'Dig',
      'Alt er fint...',
    );
  },
  tys (game) {
    game.setState({
      statAngst: game.state.statAngst + 2,
      statStress: game.state.statStress - 1,
      tys: true,
    });

    game.setDialog(
      'Dig',
      'Shhh... kan du ikke lige være stille?',
    );
  },
  harignorer(game) {
    return game.state.ignorer;
  },

  hartys(game) {
    return game.state.tys;
  },
  forsinket (game) {
    game.setState({
      statAngst: game.state.statAngst + 2,
      statStress: game.state.statStress - 1,
      statTime: game.state.statTime - 15,
      forsinket: true,
    });

    game.setDialog(
      'Dig',
      'Pis, mit tog er kørt... så skal jeg vente på det næste...',
    );
  },
  harforsinket(game) {
    return game.state.forsinket;
  },

  ignorerham (game) {
    game.setState({
      statAngst: game.state.statAngst + 1,
      ignorerham: true,
    });

    game.setDialog(
      'Dig',
      'Alt er fint...',
    );
    game.playSfx('jumpscare');
  },
  flabetsvar (game) {
    game.setState({
      statAngst: game.state.statAngst + 2,
      statStress: game.state.statStress - 1,
      flabetsvar: true,
    });

    game.setDialog(
      'Mand',
      'Flabede unge...',
      '#6724ff',
    );
    game.playSfx('jumpscare');
  },
  irri (game) {
    game.playSfx('jumpscare');

  },
  harignorerham(game) {
    return game.state.ignorerham;
  },
  harirri(game) {
    return game.state.irri;
  },

  harflabetsvar(game) {
    return game.state.flabetsvar;
  },


  ståAfTog (game) {
    const sfx = game.playSfx('dooropen');

    if (sfx) {
      sfx.onended = () => {
        game.goTo('station2-scene');
      };
    }
  },
  ståAfTog1 (game) {
    const sfx = game.playSfx('dooropen');

    if (sfx) {
      sfx.onended = () => {
        game.goTo('slutA-valg2');
      };
    }
  },
  ståAfToget (game) {
    const sfx = game.playSfx('dooropen');

    if (sfx) {
      sfx.onended = () => {
        game.goTo('itog1');
      };
    }
  },
  ståAfTog2 (game) {
    const sfx = game.playSfx('dooropen');

    if (sfx) {
      sfx.onended = () => {
        game.goTo('slutB-valg2');
      };
    }
  },
  ståAfTog3 (game) {

    const sfx = game.playSfx('dooropen');

    if (sfx) {
      sfx.onended = () => {
        game.goTo('slutA-valg1');
      };
    }
  },
  ståAfTog4 (game) {

    const sfx = game.playSfx('dooropen');

    if (sfx) {
      sfx.onended = () => {
        game.goTo('slutB-valg1');
      };
    }
  },
  øjnkontakt (game) {
    game.setState({
      statAngst: game.state.statStress + 5,
      statStress: game.state.statAngst + 5,
      er: true,
    })
    game.setDialog(
      'Dig',
      'Fuck... vi fik øjenkontakt.',
    );
  },
  ikkeøjnkontakt (game) {
    game.setState({
      statStress: game.state.statStress + 4,
      ikke:true,
    })
  },
  ignoreralt (game) {
    game.setState({
      statStress: game.state.statStress + 0,
      ignoreralt:true,
    })
    game.setDialog(
      'Dig',
      '...',
    );
  },
  harøjnkontakt(game) {
    return game.state.øjnkontakt;
  },

  harikkeøjnkontakt(game) {
    return game.state.ikkeøjnkontakt;
  },
  harignoreralt(game) {
    return game.state.ignoreralt;
  },
  givpenge (game) {
    game.setState({
      statStress: game.state.statStress + 1,
      statAngst: game.state.statAngst + 1,
      givpenge: true,
    })
    game.setDialog(
      'Mand',
      'Ej, hvor er du bare sød!',
      '#6724ff',
    );
  },
  hargivpenge(game) {
    return game.state.givpenge;
  },
  ja (game) {
    game.setState({
      statStress: game.state.statStress - 3,
      ja: true,
    })
    game.setDialog(
      'Dig',
      'Ja, jeg ved godt, at toget bliver aflyst af og til...',
      '#7DBF58',
    );
    game.playSfx('scary');
  },
  harja(game) {
    return game.state.ja;
  },
  seirri (game) {
    game.setState({
      statAngst: game.state.statAngst - 3,
      seirri: true,
    })
    game.setDialog(
      'Dig',
      'Ja, jeg ved godt, at toget bliver aflyst af og til...',
    );
  },
  harseirri(game) {
    return game.state.seirri;
  },
  nej (game) {
    game.setState({
      statStress: game.state.statStress + 1,
      nej: true,
    })
    game.setDialog(
      'Mand',
      'Heh, nå.',
      '#6724ff',
    );
  },
  harnej(game) {
    return game.state.nej;
  },
  Hmm (game) {
    game.setState({
      statStress: game.state.statStress + 1,
      Hmm: true,
    })
    game.setDialog(
      'Mand',
      'SVAR MIG!',
      '#6724ff',
    );
  },
  harHmm(game) {
    return game.state.Hmm;
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
        'Det kræver et togskifte midtvejs...',
        '#bdf9ac',
      );
    }
    if (game.state.statTime < -20) {
      game.setDialog(
        'Dig',
        'Der ankommer et tog om 20 minutter. Jeg vil blive 5-10 minutter forsinket til min jobsamtale.',
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
  startSceneId: 'intro-scene',
  initialState: storyInitialState,
  conditions: /** @type {Record<string, import('./engine.js').EngineCondition>} */ (
    storyConditions
  ),
  actions: /** @type {Record<string, import('./engine.js').EngineAction>} */ (
    storyActions
  ),
});

