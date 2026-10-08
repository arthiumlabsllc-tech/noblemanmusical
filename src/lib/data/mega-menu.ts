export interface MegaMenuCategory {
  label: string;
  href: string;
  columns: MegaMenuColumn[];
}

export interface MegaMenuColumn {
  title: string;
  items: { label: string; href: string; badge?: string }[];
}

export interface BrandLink {
  name: string;
  href: string;
  color: string;
}

export const megaMenuData: MegaMenuCategory[] = [
  {
    label: "Guitars",
    href: "/shop?category=guitars",
    columns: [
      {
        title: "Electric Guitars",
        items: [
          { label: "Stratocaster", href: "/shop?category=guitars&type=electric" },
          { label: "Les Paul", href: "/shop?category=guitars&type=electric" },
          { label: "Telecaster", href: "/shop?category=guitars&type=electric" },
          { label: "SG", href: "/shop?category=guitars&type=electric" },
          { label: "Superstrat", href: "/shop?category=guitars&type=electric" },
        ],
      },
      {
        title: "Acoustic Guitars",
        items: [
          { label: "Dreadnought", href: "/shop?category=guitars&type=acoustic" },
          { label: "Concert", href: "/shop?category=guitars&type=acoustic" },
          { label: "Classical", href: "/shop?category=guitars&type=classical" },
          { label: "12-String", href: "/shop?category=guitars&type=acoustic" },
        ],
      },
      {
        title: "Bass Guitars",
        items: [
          { label: "Precision Bass", href: "/shop?category=basses" },
          { label: "Jazz Bass", href: "/shop?category=basses" },
          { label: "5-String Bass", href: "/shop?category=basses" },
          { label: "Acoustic Bass", href: "/shop?category=basses" },
        ],
      },
    ],
  },
  {
    label: "Amps & Effects",
    href: "/shop?category=amps-and-effects",
    columns: [
      {
        title: "Guitar Amplifiers",
        items: [
          { label: "Combo Amps", href: "/shop?category=amps-and-effects&type=combo" },
          { label: "Head & Cabinet", href: "/shop?category=amps-and-effects&type=head" },
          { label: "Tube Amps", href: "/shop?category=amps-and-effects&type=tube" },
          { label: "Modeling Amps", href: "/shop?category=amps-and-effects&type=modeling" },
        ],
      },
      {
        title: "Bass Amplifiers",
        items: [
          { label: "Bass Combos", href: "/shop?category=amps-and-effects&type=bass-combo" },
          { label: "Bass Heads", href: "/shop?category=amps-and-effects&type=bass-head" },
        ],
      },
      {
        title: "Effects Pedals",
        items: [
          { label: "Overdrive / Distortion", href: "/shop?category=amps-and-effects&type=overdrive" },
          { label: "Delay / Reverb", href: "/shop?category=amps-and-effects&type=delay" },
          { label: "Modulation", href: "/shop?category=amps-and-effects&type=modulation" },
          { label: "Multi-Effects", href: "/shop?category=amps-and-effects&type=multi" },
          { label: "Pedalboards", href: "/shop?category=amps-and-effects&type=pedalboard", badge: "New" },
        ],
      },
    ],
  },
  {
    label: "Drums",
    href: "/shop?category=drums",
    columns: [
      {
        title: "Acoustic Drums",
        items: [
          { label: "Drum Kits", href: "/shop?category=drums&type=kits" },
          { label: "Snare Drums", href: "/shop?category=drums&type=snares" },
          { label: "Cymbals", href: "/shop?category=drums&type=cymbals" },
          { label: "Hardware", href: "/shop?category=drums&type=hardware" },
        ],
      },
      {
        title: "Electronic Drums",
        items: [
          { label: "E-Drum Kits", href: "/shop?category=drums&type=electronic" },
          { label: "Drum Modules", href: "/shop?category=drums&type=modules" },
          { label: "Drum Pads", href: "/shop?category=drums&type=pads" },
        ],
      },
      {
        title: "Percussion",
        items: [
          { label: "Congas & Bongos", href: "/shop?category=drums&type=percussion" },
          { label: "Cajons", href: "/shop?category=drums&type=cajons" },
          { label: "Djembes", href: "/shop?category=drums&type=djembes" },
        ],
      },
    ],
  },
  {
    label: "Keyboards",
    href: "/shop?category=keyboards",
    columns: [
      {
        title: "Digital Pianos",
        items: [
          { label: "Home Pianos", href: "/shop?category=keyboards&type=home-piano" },
          { label: "Stage Pianos", href: "/shop?category=keyboards&type=stage-piano" },
          { label: "Portable Pianos", href: "/shop?category=keyboards&type=portable" },
        ],
      },
      {
        title: "Synthesizers",
        items: [
          { label: "Analog Synths", href: "/shop?category=keyboards&type=analog", badge: "Hot" },
          { label: "Digital Synths", href: "/shop?category=keyboards&type=digital" },
          { label: "Workstations", href: "/shop?category=keyboards&type=workstation" },
        ],
      },
      {
        title: "MIDI & Controllers",
        items: [
          { label: "MIDI Keyboards", href: "/shop?category=keyboards&type=midi" },
          { label: "MIDI Pads", href: "/shop?category=keyboards&type=midi-pads" },
          { label: "Control Surfaces", href: "/shop?category=keyboards&type=control" },
        ],
      },
    ],
  },
  {
    label: "Live Sound",
    href: "/shop?category=live-sound",
    columns: [
      {
        title: "PA Systems",
        items: [
          { label: "Powered Speakers", href: "/shop?category=live-sound&type=powered" },
          { label: "Passive Speakers", href: "/shop?category=live-sound&type=passive" },
          { label: "Subwoofers", href: "/shop?category=live-sound&type=subs" },
          { label: "PA Bundles", href: "/shop?category=live-sound&type=bundles" },
        ],
      },
      {
        title: "Mixers",
        items: [
          { label: "Analog Mixers", href: "/shop?category=live-sound&type=analog-mixer" },
          { label: "Digital Mixers", href: "/shop?category=live-sound&type=digital-mixer" },
          { label: "Compact Mixers", href: "/shop?category=live-sound&type=compact" },
        ],
      },
      {
        title: "Monitors & In-Ears",
        items: [
          { label: "Stage Monitors", href: "/shop?category=live-sound&type=monitors" },
          { label: "In-Ear Monitors", href: "/shop?category=live-sound&type=iem" },
          { label: "Monitor Mixers", href: "/shop?category=live-sound&type=monitor-mixer" },
        ],
      },
    ],
  },
  {
    label: "Recording",
    href: "/shop?category=recording",
    columns: [
      {
        title: "Audio Interfaces",
        items: [
          { label: "USB Interfaces", href: "/shop?category=recording&type=usb" },
          { label: "Thunderbolt", href: "/shop?category=recording&type=thunderbolt" },
          { label: "Rack Interfaces", href: "/shop?category=recording&type=rack" },
        ],
      },
      {
        title: "Studio Monitors",
        items: [
          { label: "Active Monitors", href: "/shop?category=recording&type=active" },
          { label: "Passive Monitors", href: "/shop?category=recording&type=passive" },
          { label: "Subwoofers", href: "/shop?category=recording&type=subs" },
        ],
      },
      {
        title: "Headphones & Accessories",
        items: [
          { label: "Studio Headphones", href: "/shop?category=recording&type=headphones" },
          { label: "Mic Stands & Booms", href: "/shop?category=recording&type=stands" },
          { label: "Cables & Adapters", href: "/shop?category=recording&type=cables" },
          { label: "Acoustic Treatment", href: "/shop?category=recording&type=acoustic" },
        ],
      },
    ],
  },
  {
    label: "Microphones",
    href: "/shop?category=live-sound&type=microphones",
    columns: [
      {
        title: "Vocal Microphones",
        items: [
          { label: "Dynamic Vocals", href: "/shop?category=live-sound&type=dynamic-vocal" },
          { label: "Condenser Vocals", href: "/shop?category=live-sound&type=condenser-vocal" },
          { label: "Wireless Systems", href: "/shop?category=live-sound&type=wireless", badge: "Popular" },
        ],
      },
      {
        title: "Instrument Mics",
        items: [
          { label: "Drum Mics", href: "/shop?category=live-sound&type=drum-mic" },
          { label: "Guitar Amp Mics", href: "/shop?category=live-sound&type=guitar-mic" },
          { label: "Stereo Pair", href: "/shop?category=live-sound&type=stereo" },
        ],
      },
      {
        title: "Studio Microphones",
        items: [
          { label: "Large Diaphragm", href: "/shop?category=recording&type=large-diaphragm" },
          { label: "Small Diaphragm", href: "/shop?category=recording&type=small-diaphragm" },
          { label: "Ribbons", href: "/shop?category=recording&type=ribbon" },
          { label: "USB Microphones", href: "/shop?category=recording&type=usb-mic" },
        ],
      },
    ],
  },
];

export const featuredBrands: BrandLink[] = [
  { name: "Fender", href: "/shop?brand=fender", color: "#E4002B" },
  { name: "Gibson", href: "/shop?brand=gibson", color: "#1a1a1a" },
  { name: "Yamaha", href: "/shop?brand=yamaha", color: "#003399" },
  { name: "Roland", href: "/shop?brand=roland", color: "#0066B3" },
  { name: "Shure", href: "/shop?brand=shure", color: "#1a1a1a" },
  { name: "Pearl", href: "/shop?brand=pearl", color: "#8B0000" },
  { name: "Boss", href: "/shop?brand=boss", color: "#FF6600" },
  { name: "Sennheiser", href: "/shop?brand=sennheiser", color: "#006633" },
];
