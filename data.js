
// Hex stats template
window.hexStats = [
  { id: "mettle", title: "METTLE" },
  { id: "physique", title: "PHYSIQUE" },
  { id: "influence", title: "INFLUENCE" },
  { id: "expertise", title: "EXPERTISE" },
  { id: "conviction", title: "CONVICTION" }
];

// Map roles → move IDs → initial checked state
window.availableMap = {
    "Navigator": {
        "a1b2c3": true,
        "d4e5f6": false,
        "g7h8i9": true,
        "1587dd": false,
        "nav001": false
    },
    "Mech Adept": {
        "m1a2b3": false,
        "m4c5d6": false,
        "m7e8f9": false,
        "85757e": false
    },
    "Lord Commander": {
        "l1a2b3": false,
        "l4c5d6": false,
        "l7e8f9": false,
        "lc001": false,
        "adapt1": false
    }
};

window.moves = [{

        id: "a1b2c3",
        title: "Chart the Immaterium (+Conviction)",
        outcomes: [{
                range: "≥ 10",
                text: "The passage is smooth and precise. You emerge exactly where intended.",
                bullets: []
            },
            {
                range: "7–9",
                text: "You reach the destination, but choose one:",
                bullets: [
                    "The voyage takes longer than expected",
                    "The ship suffers debility or damage",
                    "You attract unwanted attention"
                ]
            },
            {
                range: "≤ 6",
                text: "GM chooses one:",
                bullets: [
                    "You emerge off-course",
                    "The voyage has taken far too long",
                    "A warp intrusion threatens the ship",
                    "Your mind or soul suffers strain; mark 1 Debility or permanent stigma."
                ]
            }
        ]
    },
    {

        id: "d4e5f6",
        title: "Scan the Astropathic Beacon",
        outcomes: [{
                range: "≥ 10",
                text: "You receive a clear psychic signal.",
                bullets: []
            },
            {
                range: "7–9",
                text: "The signal is fuzzy, choose one:",
                bullets: [
                    "You misinterpret part of the message",
                    "The beacon signals a false location"
                ]
            },
            {
                range: "≤ 6",
                text: "The signal is incomprehensible:",
                bullets: [
                    "You feel psychic backlash",
                    "Your mind is shaken, mark 1 Debility"
                ]
            }
        ]
    },
    {
        id: "g7h8i9",
        title: "Navigate the Warp Currents",
        outcomes: [{
                range: "≥ 10",
                text: "Your navigation is flawless.",
                bullets: []
            },
            {
                range: "7–9",
                text: "Partial success:",
                bullets: [
                    "You drift slightly off course",
                    "Minor strain on crew"
                ]
            },
            {
                range: "≤ 6",
                text: "Catastrophic:",
                bullets: [
                    "Major warp disruption",
                    "Crew suffers stress and debility"
                ]
            }
        ]
    },
    {
        id: "1587dd",
        title: "Blighted Eye - Your eye is a weapon inflicting moderate damage",
        outcomes: [{
            range: "",
            text: "Pick one"
        }],
        pick: [
            "Area",
            "Messy"
        ]
    },
    {
        id: "85757e",
        title: "Relic Weapon - You have a priceless relic of the before time, choose 2 then +1 for each additional time you take this move:",
        multiple: 3,
        pick: [
            "+1 Harm",
            "Armor Piercing",
            "Reliable",
            "Precise",
            "Terrifying",
            "Messy"
        ]
    }
];

window.moves.push(
    // ==== MECH ADEPT ====
    {
        id: "m1a2b3",
        title: "Invoke the Machine Spirit (+Conviction)",
        outcomes: [{
                range: "≥ 10",
                text: "The machine spirit answers eagerly, purring with devotion. Systems operate at peak efficiency.",
                bullets: []
            },
            {
                range: "7–9",
                text: "The spirit responds, but demands concession. Choose one:",
                bullets: [
                    "The machine works, but sluggishly or erratically",
                    "It requires ritual sacrifice of resources, time, or components",
                    "The spirit whispers cryptic warnings—GM will tell you what"
                ]
            },
            {
                range: "≤ 6",
                text: "The spirit rebels in fury:",
                bullets: [
                    "It locks up or malfunctions at the worst possible moment",
                    "It hungers for your blood—suffer 1 Harm",
                    "You awaken echoes of something beyond the machine, an alien or warp-born presence"
                ]
            }
        ]
    },
    {
        id: "m4c5d6",
        title: "Augmetic Overload (+Physique)",
        outcomes: [{
                range: "≥ 10",
                text: "Your enhancements surge with flawless precision. You perform superhuman feats with no ill effect.",
                bullets: []
            },
            {
                range: "7–9",
                text: "Power flows, but imperfectly. Choose one:",
                bullets: [
                    "Gain what you seek, but your augmetics suffer stress—mark 1 Debility",
                    "The surge draws dangerous attention (electrical storms, enemy sensors, hostile spirits)",
                    "You succeed, but your flesh protests—mark 1 Harm"
                ]
            },
            {
                range: "≤ 6",
                text: "Catastrophic feedback:",
                bullets: [
                    "Your augmetics shut down at a critical moment",
                    "You fry delicate systems nearby",
                    "The machine spirit claims part of your flesh—permanent mutation or scar"
                ]
            }
        ]
    },
    {
        id: "m7e8f9",
        title: "Techno-Exorcism (+Expertise)",
        outcomes: [{
                range: "≥ 10",
                text: "The corrupted device is purged. Holy code floods its systems, restoring it to sanctity.",
                bullets: []
            },
            {
                range: "7–9",
                text: "The corruption recoils but not completely. Choose one:",
                bullets: [
                    "The device functions but remains tainted—GM will say how",
                    "You draw the attention of hostile entities (data-daemons, rogue code, or worse)",
                    "The exorcism drains you; mark 1 Debility"
                ]
            },
            {
                range: "≤ 6",
                text: "The corruption fights back:",
                bullets: [
                    "The device is utterly destroyed in the conflict",
                    "The infection spreads to your own augmetics",
                    "The machine’s scream echoes in your skull—mark permanent stigma"
                ]
            }
        ]
    },

    // ==== LORD COMMANDER ====
    {
        id: "l1a2b3",
        title: "Rally the Cohort (+Influence)",
        outcomes: [{
                range: "≥ 10",
                text: "Your voice cuts through the din of battle. Morale surges and your warriors act with fearless precision.",
                bullets: []
            },
            {
                range: "7–9",
                text: "They obey, but hesitation or doubt lingers. Choose one:",
                bullets: [
                    "They follow, but at greater cost—suffer losses or spend excess resources",
                    "They succeed, but act with brutal zealotry, creating collateral damage",
                    "They hesitate at a crucial moment; GM decides the consequence"
                ]
            },
            {
                range: "≤ 6",
                text: "Your command falters:",
                bullets: [
                    "The troops break and scatter in fear",
                    "They misinterpret your order with disastrous results",
                    "A rival seizes the moment to undermine your authority"
                ]
            }
        ]
    },
    {
        id: "l4c5d6",
        title: "Strategic Gambit (+Expertise)",
        outcomes: [{
                range: "≥ 10",
                text: "Your plan unfolds with uncanny precision. The enemy is caught utterly unprepared.",
                bullets: []
            },
            {
                range: "7–9",
                text: "Your gambit works, but at a price. Choose one:",
                bullets: [
                    "You suffer losses or sacrifice position",
                    "The enemy learns more about your strategy than you’d like",
                    "The maneuver leaves you temporarily vulnerable"
                ]
            },
            {
                range: "≤ 6",
                text: "Your scheme collapses:",
                bullets: [
                    "The enemy anticipates your move and counterattacks brutally",
                    "Your forces are mispositioned and at risk",
                    "The plan fractures your command’s unity—infighting erupts"
                ]
            }
        ]
    },
    {
        id: "l7e8f9",
        title: "Voice of Dominion (+Mettle)",
        outcomes: [{
                range: "≥ 10",
                text: "All within earshot—or vox-channel—fall silent. Your decree is law; none dare defy you.",
                bullets: []
            },
            {
                range: "7–9",
                text: "Most obey, but not all. Choose one:",
                bullets: [
                    "A subordinate quietly resents and plots against you",
                    "Your authority works, but only for now—expect future rebellion",
                    "Obedience is absolute, but instills fear, not loyalty"
                ]
            },
            {
                range: "≤ 6",
                text: "Your command sparks defiance:",
                bullets: [
                    "Your order is openly challenged",
                    "Discipline shatters as factions arise",
                    "Your authority is mocked, undermining morale and control"
                ]
            }
        ]
    },
    {
        id: "lc001",
        title: "Tactical Superiority - Each time taken, add +1 die to tactical rolls",
        multiple: 2,
        outcomes: [{
            range: "≥ 10",
            text: "Your strategic insight is flawless. Enemies fall into your carefully laid traps.",
            bullets: []
        },
        {
            range: "7–9",
            text: "Your tactics succeed, but choose one:",
            bullets: [
                "Victory comes at higher cost than expected",
                "You reveal your strategic approach to watching enemies",
                "Success breeds overconfidence in your ranks"
            ]
        },
        {
            range: "≤ 6",
            text: "Your tactics backfire:",
            bullets: [
                "The enemy anticipated your move and counterattacks",
                "Your forces are caught out of position",
                "Morale suffers as troops question your leadership"
            ]
        }]
    },
    {
        id: "adapt1",
        title: "Adaptable - Learn techniques from other roles",
        takefrom: ["Navigator", "Mech Adept"]
    
    }
);
