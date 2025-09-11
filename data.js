// Map roles → move IDs → initial checked state
window.availableMap = {
  "Navigator": { "a1b2c3": true, "d4e5f6": false, "g7h8i9": true },
  "Mech Adept": { "m1a2b3": false, "m4c5d6": true, "m7e8f9": false },
  "Lord Commander": { "l1a2b3": true, "l4c5d6": true, "l7e8f9": true }
};

window.moves = [
    {
	
	id: "a1b2c3", 
      title: "Chart the Immaterium (+Conviction)",
      outcomes: [
        { range: "≥ 10", text: "The passage is smooth and precise. You emerge exactly where intended.", bullets: [] },
        { range: "7–9", text: "You reach the destination, but choose one:", bullets: [
          "The voyage takes longer than expected",
          "The ship suffers debility or damage",
          "You attract unwanted attention"
        ]},
        { range: "≤ 6", text: "GM chooses one:", bullets: [
          "You emerge off-course",
          "The voyage has taken far too long",
          "A warp intrusion threatens the ship",
          "Your mind or soul suffers strain; mark 1 Debility or permanent stigma."
        ]}
      ]
    },
    {
		
      id: "d4e5f6",
      title: "Scan the Astropathic Beacon",
      outcomes: [
        { range: "≥ 10", text: "You receive a clear psychic signal.", bullets: [] },
        { range: "7–9", text: "The signal is fuzzy, choose one:", bullets: [
          "You misinterpret part of the message",
          "The beacon signals a false location"
        ]},
        { range: "≤ 6", text: "The signal is incomprehensible:", bullets: [
          "You feel psychic backlash",
          "Your mind is shaken, mark 1 Debility"
        ]}
      ]
    },
    {
      id: "g7h8i9",
      title: "Navigate the Warp Currents",
      outcomes: [
        { range: "≥ 10", text: "Your navigation is flawless.", bullets: [] },
        { range: "7–9", text: "Partial success:", bullets: [
          "You drift slightly off course",
          "Minor strain on crew"
        ]},
        { range: "≤ 6", text: "Catastrophic:", bullets: [
          "Major warp disruption",
          "Crew suffers stress and debility"
        ]}
      ]
    }
  ];