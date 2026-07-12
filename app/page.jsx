'use client';

import React, { useState, useMemo } from 'react';
import { Search, Plus, Users, X, Trash2, ChevronLeft, Sparkles, LayoutGrid, ShieldCheck, Lock, Camera, MapPin, User } from 'lucide-react';

const C = {
  bg: '#F1E7C6',
  surface: '#FBF3DC',
  surfaceLight: '#FFFCF2',
  ink: '#1C1A15',
  muted: '#8C7F5E',
  red: '#E4032E',
  blue: '#0056A4',
  green: '#0C8A46',
  gold: '#C9A227',
  border: '#DFC98D',
  danger: '#C1272D',
};

const CLUBS = {
  'FC Augsburg': { p: '#BA3733', s: '#046A38' },
  '1. FC Union Berlin': { p: '#EB1923', s: '#FFD100' },
  'SV Werder Bremen': { p: '#1D9053', s: '#FFFFFF' },
  'Borussia Dortmund': { p: '#FDE100', s: '#000000' },
  'Eintracht Frankfurt': { p: '#E1000F', s: '#000000' },
  'SC Freiburg': { p: '#E2001A', s: '#000000' },
  'Hamburger SV': { p: '#0A2240', s: '#FFFFFF' },
  '1. FC Heidenheim': { p: '#E2001A', s: '#004B93' },
  'TSG 1899 Hoffenheim': { p: '#1961B5', s: '#FFFFFF' },
  '1. FC Köln': { p: '#ED1C24', s: '#FFFFFF' },
  'RB Leipzig': { p: '#DD0741', s: '#FFFFFF' },
  'Bayer 04 Leverkusen': { p: '#E32221', s: '#000000' },
  '1. FSV Mainz 05': { p: '#C3141E', s: '#FFFFFF' },
  'Borussia Mönchengladbach': { p: '#00A651', s: '#000000' },
  'FC Bayern München': { p: '#DC052D', s: '#0A2240' },
  'FC St. Pauli': { p: '#603017', s: '#FFFFFF' },
  'VfB Stuttgart': { p: '#E30613', s: '#FFFFFF' },
  'VfL Wolfsburg': { p: '#65B32E', s: '#FFFFFF' },
  'SpVgg Greuther Fürth': { p: '#00612E', s: '#FFFFFF' },
};

// Echte Seltenheiten/Parallel-Bezeichnungen aus der 2025-26 Topps Chrome Bundesliga Checkliste
// (checklistinsider.com, Stand 07.05.2026). "Wave"-Varianten existieren farblich zu jeder
// Refractor-Stufe (z.B. "Blue Wave Refractor /150") und werden über den "Wave Refractor"-Filter
// erfasst; weitere Mini-Diamond/Lava-Varianten sind auf Anfrage ergänzbar.
const RARITY_ORDER = [
  'Base',
  'Aqua Refractor',
  'Blue Refractor',
  'Green Refractor',
  'Purple Refractor',
  'ToppsFractor',
  'Gold Refractor',
  'Orange Refractor',
  'Black Refractor',
  'Red Refractor',
  'Wave Refractor',
  'FrozenFractor',
  'SuperFractor',
  'Autograph',
  'Electrified',
  'Illumination',
  'Ornaments',
  'Ultrabeam',
  'Wild Jungle',
  'Club Logo',
  'Black Spectrum Limited Edition',
  'Helix',
  'Shadow Etch',
  'Anime',
  'All-Etch Rookie Rush',
];

// Farbe je Parallel-Familie fürs Karten-Rahmen-Styling — orientiert an der echten Refractor-Farbe.
const PARALLEL_COLORS = {
  'Aqua Refractor': '#3FBFBF',
  'Blue Refractor': '#0056A4',
  'Green Refractor': '#0C8A46',
  'Purple Refractor': '#7B3FA0',
  'ToppsFractor': '#8A8F98',
  'Gold Refractor': '#C9A227',
  'Orange Refractor': '#E2711D',
  'Black Refractor': '#1C1A15',
  'Red Refractor': '#C1272D',
};

// Echte Gesamtauflagen je Parallel-Stufe (Topps Chrome Bundesliga 25/26). SuperFractor ist
// immer 1/1. Bei allen anderen Seltenheiten (Wave Refractor, FrozenFractor, Insert-Sets,
// Autograph) variiert die Auflage je Karte, deshalb dort keine feste Vorgabe.
const FIXED_PRINT_RUNS = {
  'Aqua Refractor': 199,
  'Blue Refractor': 150,
  'Green Refractor': 99,
  'Purple Refractor': 75,
  'ToppsFractor': 52,
  'Gold Refractor': 50,
  'Orange Refractor': 25,
  'Black Refractor': 10,
  'Red Refractor': 5,
  'SuperFractor': 1,
};

// Größte Anbieter für Fußball-Sammelkarten + ihre wichtigsten Sets der letzten Saisons.
// Topps hält die offizielle Bundesliga-Lizenz seit 2008/09 sowie UEFA Champions League;
// Panini ist der zweite große Anbieter (Adrenalyn XL, Prizm, Donruss/Optic, Top Class).
const SETS = [
  { id: 's1', name: 'Topps Chrome Bundesliga 25/26', manufacturer: 'Topps', year: '2025/26' },
  { id: 's2', name: 'Topps Match Attax Bundesliga 25/26', manufacturer: 'Topps', year: '2025/26' },
  { id: 's3', name: 'Topps Finest Bundesliga 24/25', manufacturer: 'Topps', year: '2024/25' },
  { id: 's4', name: 'Topps Match Attax UEFA Champions League 25/26', manufacturer: 'Topps', year: '2025/26' },
  { id: 's5', name: 'Topps Museum Collection Bundesliga 24/25', manufacturer: 'Topps', year: '2024/25' },
  { id: 's6', name: 'Panini Adrenalyn XL Bundesliga 25/26', manufacturer: 'Panini', year: '2025/26' },
  { id: 's7', name: 'Panini Donruss / Optic Bundesliga 24/25', manufacturer: 'Panini', year: '2024/25' },
  { id: 's8', name: 'Panini Prizm UEFA Champions League 25/26', manufacturer: 'Panini', year: '2025/26' },
  { id: 's9', name: 'Panini FIFA Top Class 2025', manufacturer: 'Panini', year: '2025' },
];

// Erzeugt alle Exemplare einer limitierten Auflage (z. B. 1/25 bis 25/25) als einzelne
// Katalogeinträge – jede Seriennummer ist eine eigene, einzigartige physische Karte.
function generateSerialFamily({ prefix, print, ...base }) {
  return Array.from({ length: print }, (_, i) => ({ id: `${prefix}${i + 1}`, ...base, num: i + 1, print }));
}

const HARRY_KANE_AUTO = generateSerialFamily({
  prefix: 'hk-auto-',
  player: 'Harry Kane',
  club: 'FC Bayern München',
  pos: 'ST',
  season: '2025/26',
  setId: 's1',
  rarity: 'Autograph',
  auto: true,
  print: 25,
});

// Quelle: checklistinsider.com, "2025-26 Topps Chrome Bundesliga Soccer Checklist Guide"
// (Stand 07.05.2026) — komplettes Base Set, 100 Karten.
const BASE_CARDS = [
  { id: 'tcb2526-1', player: 'Chrislain Matsima', club: 'FC Augsburg', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 1, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-2', player: 'Mert Kömür', club: 'FC Augsburg', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 2, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-3', player: 'Alexis Claude-Maurice', club: 'FC Augsburg', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 3, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-4', player: 'Ismaël Gharbi', club: 'FC Augsburg', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 4, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-5', player: 'Samuel Essende', club: 'FC Augsburg', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 5, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-6', player: 'Tom Rothe', club: '1. FC Union Berlin', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 6, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-7', player: 'Leopold Querfeld', club: '1. FC Union Berlin', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 7, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-8', player: 'Ilyas Ansah', club: '1. FC Union Berlin', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 8, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-9', player: 'Oliver Burke', club: '1. FC Union Berlin', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 9, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-10', player: 'Andrej Ilić', club: '1. FC Union Berlin', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 10, print: 100, auto: false, rookie: true },
  { id: 'tcb2526-11', player: 'Victor Boniface', club: '1. FC Union Berlin', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 11, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-12', player: 'Yukinari Sugawara', club: 'SV Werder Bremen', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 12, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-13', player: 'Karim Coulibaly', club: 'SV Werder Bremen', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 13, print: 100, auto: false, rookie: true },
  { id: 'tcb2526-14', player: 'Patrice Čović', club: 'SV Werder Bremen', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 14, print: 100, auto: false, rookie: true },
  { id: 'tcb2526-15', player: 'Cameron Puertas', club: 'SV Werder Bremen', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 15, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-16', player: 'Daniel Svensson', club: 'Borussia Dortmund', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 16, print: 100, auto: false, rookie: true },
  { id: 'tcb2526-17', player: 'Nico Schlotterbeck', club: 'Borussia Dortmund', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 17, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-18', player: 'Jobe Bellingham', club: 'Borussia Dortmund', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 18, print: 100, auto: false, rookie: true },
  { id: 'tcb2526-19', player: 'Karim Adeyemi', club: 'Borussia Dortmund', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 19, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-20', player: 'Ousmane Diallo', club: 'Borussia Dortmund', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 20, print: 100, auto: false, rookie: true },
  { id: 'tcb2526-21', player: 'Carney Chukwuemeka', club: 'Borussia Dortmund', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 21, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-22', player: 'Serhou Guirassy', club: 'Borussia Dortmund', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 22, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-23', player: 'Nathaniel Brown', club: 'Eintracht Frankfurt', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 23, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-24', player: 'Ritsu Doan', club: 'Eintracht Frankfurt', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 24, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-25', player: 'Hugo Larsson', club: 'Eintracht Frankfurt', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 25, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-26', player: 'Jean-Matteo Bahoya', club: 'Eintracht Frankfurt', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 26, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-27', player: 'Can Uzun', club: 'Eintracht Frankfurt', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 27, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-28', player: 'Jonathan Burkardt', club: 'Eintracht Frankfurt', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 28, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-29', player: 'Noah Atubolu', club: 'SC Freiburg', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 29, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-30', player: 'Cyriaque Irié', club: 'SC Freiburg', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 30, print: 100, auto: false, rookie: true },
  { id: 'tcb2526-31', player: 'Johan Manzambi', club: 'SC Freiburg', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 31, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-32', player: 'Yuito Suzuki', club: 'SC Freiburg', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 32, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-33', player: 'Igor Matanović', club: 'SC Freiburg', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 33, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-34', player: 'Wisdom Mike', club: 'FC Bayern München', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 34, print: 100, auto: false, rookie: true },
  { id: 'tcb2526-35', player: 'Luka Vušković', club: 'Hamburger SV', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 35, print: 100, auto: false, rookie: true },
  { id: 'tcb2526-36', player: 'Fabio Vieira', club: 'Hamburger SV', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 36, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-37', player: 'Albert Lokonga', club: 'Hamburger SV', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 37, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-38', player: 'Jean-Luc Dompé', club: 'Hamburger SV', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 38, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-39', player: 'Ransford-Yeboah Königsdörffer', club: 'Hamburger SV', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 39, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-40', player: 'Patrick Mainka', club: '1. FC Heidenheim', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 40, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-41', player: 'Diant Ramaj', club: '1. FC Heidenheim', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 41, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-42', player: 'Mathias Honsak', club: '1. FC Heidenheim', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 42, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-43', player: 'Arijon Ibrahimović', club: '1. FC Heidenheim', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 43, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-44', player: 'Budu Zivzivadze', club: '1. FC Heidenheim', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 44, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-45', player: 'Leon Avdullahu', club: 'TSG 1899 Hoffenheim', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 45, print: 100, auto: false, rookie: true },
  { id: 'tcb2526-46', player: 'Fisnik Asllani', club: 'TSG 1899 Hoffenheim', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 46, print: 100, auto: false, rookie: true },
  { id: 'tcb2526-47', player: 'Bazoumana Touré', club: 'TSG 1899 Hoffenheim', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 47, print: 100, auto: false, rookie: true },
  { id: 'tcb2526-48', player: 'Muhammed Damar', club: 'TSG 1899 Hoffenheim', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 48, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-49', player: 'Max Moerstedt', club: 'TSG 1899 Hoffenheim', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 49, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-50', player: 'Saïd El Mala', club: '1. FC Köln', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 50, print: 100, auto: false, rookie: true },
  { id: 'tcb2526-51', player: 'Ísak Jóhannesson', club: '1. FC Köln', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 51, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-52', player: 'Rav van den Berg', club: '1. FC Köln', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 52, print: 100, auto: false, rookie: true },
  { id: 'tcb2526-53', player: 'Ragnar Ache', club: '1. FC Köln', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 53, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-54', player: 'Eric Martel', club: '1. FC Köln', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 54, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-55', player: 'Rômulo Cardoso', club: 'RB Leipzig', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 55, print: 100, auto: false, rookie: true },
  { id: 'tcb2526-56', player: 'Ezechiel Banzuzi', club: 'RB Leipzig', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 56, print: 100, auto: false, rookie: true },
  { id: 'tcb2526-57', player: 'Assan Ouedraogo', club: 'RB Leipzig', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 57, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-58', player: 'Johan Bakayoko', club: 'RB Leipzig', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 58, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-59', player: 'Yan Diomande', club: 'RB Leipzig', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 59, print: 100, auto: false, rookie: true },
  { id: 'tcb2526-60', player: 'Conrad Harder', club: 'RB Leipzig', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 60, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-61', player: 'Antonio Nusa', club: 'RB Leipzig', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 61, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-62', player: 'Jarell Quansah', club: 'Bayer 04 Leverkusen', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 62, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-63', player: 'Axel Tape', club: 'Bayer 04 Leverkusen', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 63, print: 100, auto: false, rookie: true },
  { id: 'tcb2526-64', player: 'Ernest Poku', club: 'Bayer 04 Leverkusen', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 64, print: 100, auto: false, rookie: true },
  { id: 'tcb2526-65', player: 'Malik Tillman', club: 'Bayer 04 Leverkusen', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 65, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-66', player: 'Eliesse Ben Seghir', club: 'Bayer 04 Leverkusen', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 66, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-67', player: 'Christian Kofane', club: 'Bayer 04 Leverkusen', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 67, print: 100, auto: false, rookie: true },
  { id: 'tcb2526-68', player: 'Claudio Echeverri', club: 'Bayer 04 Leverkusen', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 68, print: 100, auto: false, rookie: true },
  { id: 'tcb2526-69', player: 'Kaishu Sano', club: '1. FSV Mainz 05', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 69, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-70', player: 'Nadiem Amiri', club: '1. FSV Mainz 05', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 70, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-71', player: 'Sota Kawasaki', club: '1. FSV Mainz 05', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 71, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-72', player: 'Benedict Hollerbach', club: '1. FSV Mainz 05', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 72, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-73', player: 'Paul Nebel', club: '1. FSV Mainz 05', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 73, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-74', player: 'Kevin Diks', club: 'Borussia Mönchengladbach', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 74, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-75', player: 'Rocco Reitz', club: 'Borussia Mönchengladbach', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 75, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-76', player: 'Jens Castrop', club: 'Borussia Mönchengladbach', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 76, print: 100, auto: false, rookie: true },
  { id: 'tcb2526-77', player: 'Wael Mohya', club: 'Borussia Mönchengladbach', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 77, print: 100, auto: false, rookie: true },
  { id: 'tcb2526-78', player: 'Tim Kleindienst', club: 'Borussia Mönchengladbach', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 78, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-79', player: 'Nicolas Jackson', club: 'FC Bayern München', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 79, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-80', player: 'Michael Olise', club: 'FC Bayern München', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 80, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-81', player: 'Jamal Musiala', club: 'FC Bayern München', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 81, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-82', player: 'Lennart Karl', club: 'FC Bayern München', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 82, print: 100, auto: false, rookie: true },
  { id: 'tcb2526-83', player: 'Luis Díaz', club: 'FC Bayern München', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 83, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-84', player: 'Harry Kane', club: 'FC Bayern München', pos: 'ST', season: '2025/26', setId: 's1', rarity: 'Base', num: 84, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-85', player: 'Joshua Kimmich', club: 'FC St. Pauli', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 85, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-86', player: 'Eric Smith', club: 'FC St. Pauli', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 86, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-87', player: 'Louis Oppie', club: 'FC St. Pauli', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 87, print: 100, auto: false, rookie: true },
  { id: 'tcb2526-88', player: 'Joel Chima Fujita', club: 'FC St. Pauli', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 88, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-89', player: 'Danel Sinani', club: 'FC St. Pauli', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 89, print: 100, auto: false, rookie: true },
  { id: 'tcb2526-90', player: 'Andreas Hountondji', club: 'FC St. Pauli', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 90, print: 100, auto: false, rookie: true },
  { id: 'tcb2526-91', player: 'Chema', club: 'VfB Stuttgart', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 91, print: 100, auto: false, rookie: true },
  { id: 'tcb2526-92', player: 'Angelo Stiller', club: 'VfB Stuttgart', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 92, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-93', player: 'Finn Jeltsch', club: 'VfB Stuttgart', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 93, print: 100, auto: false, rookie: true },
  { id: 'tcb2526-94', player: 'Lazar Jovanović', club: 'VfB Stuttgart', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 94, print: 100, auto: false, rookie: true },
  { id: 'tcb2526-95', player: 'Bilal El Khannouss', club: 'VfB Stuttgart', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 95, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-96', player: 'Konstantinos Koulierakis', club: 'VfL Wolfsburg', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 96, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-97', player: 'Vinicius Souza', club: 'VfL Wolfsburg', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 97, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-98', player: 'Mohammed Amoura', club: 'VfL Wolfsburg', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 98, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-99', player: 'Adam Daghim', club: 'VfL Wolfsburg', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 99, print: 100, auto: false, rookie: false },
  { id: 'tcb2526-100', player: 'Christian Eriksen', club: 'VfL Wolfsburg', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 100, print: 100, auto: false, rookie: false },
  // Von Nutzer per Foto bestätigt (Orange Refractor Autograph 02/25) — fehlte in der ursprünglich
  // recherchierten Checkliste, gehört aber nachweislich zum Set.
  { id: 'tcb2526-101', player: 'Mario Götze', club: 'Eintracht Frankfurt', pos: '', season: '2025/26', setId: 's1', rarity: 'Base', num: 101, print: 100, auto: false, rookie: false },
];

// Jede der 100 Base-Karten existiert real auch als Refractor-Parallele in mehreren Farbstufen
// bis hin zur SuperFractor 1/1 — genau wie in einer echten Chrome-Box. Die Seriennummer einer
// Parallele ist beim Ziehen aus der Packung zufällig, deshalb starten sie als "?" (baseNum
// verweist weiterhin auf die Checklisten-Position) und lässt sich beim Hinzufügen eintragen.
const REFRACTOR_TIERS = [
  { name: 'Aqua Refractor', print: 199 },
  { name: 'Blue Refractor', print: 150 },
  { name: 'Green Refractor', print: 99 },
  { name: 'Purple Refractor', print: 75 },
  { name: 'ToppsFractor', print: 52 },
  { name: 'Gold Refractor', print: 50 },
  { name: 'Orange Refractor', print: 25 },
  { name: 'Black Refractor', print: 10 },
  { name: 'Red Refractor', print: 5 },
  { name: 'SuperFractor', print: 1 },
  { name: 'FrozenFractor', print: null },
];

function expandParallels(baseCards, tiers) {
  const out = [];
  baseCards.forEach((card) => {
    tiers.forEach((tier) => {
      const slug = tier.name.replace(/\s+/g, '').toLowerCase();
      out.push({
        ...card,
        id: `${card.id}-${slug}`,
        rarity: tier.name,
        num: tier.print === 1 ? 1 : null,
        baseNum: card.num,
        print: tier.print,
      });
    });
  });
  return out;
}

const CATALOGUE = [...HARRY_KANE_AUTO, ...BASE_CARDS, ...expandParallels(BASE_CARDS, REFRACTOR_TIERS)];

// Für die Demo-Sammlung legen wir ein paar konkret gezogene Exemplare an — in der echten App
// passiert das, sobald ein Nutzer seine Karte hinzufügt bzw. die Seriennummer einträgt.
function pushKnownSerial(baseId, tierName, serialNum, auto = false) {
  const base = BASE_CARDS.find((c) => c.id === baseId);
  const tier = REFRACTOR_TIERS.find((t) => t.name === tierName);
  if (!base || !tier) return;
  const slug = tierName.replace(/\s+/g, '').toLowerCase();
  const id = `${baseId}-${slug}-${serialNum}${auto ? '-auto' : ''}`;
  CATALOGUE.push({ ...base, id, rarity: tierName, num: serialNum, baseNum: base.num, print: tier.print, auto });
}
pushKnownSerial('tcb2526-84', 'Gold Refractor', 12);
pushKnownSerial('tcb2526-18', 'Red Refractor', 2);
pushKnownSerial('tcb2526-59', 'Green Refractor', 34);
pushKnownSerial('tcb2526-96', 'Purple Refractor', 41);
pushKnownSerial('tcb2526-82', 'SuperFractor', 1);
// Jamal Musiala: zwei verschiedene Orange-Refractor-Exemplare ohne Autogramm...
pushKnownSerial('tcb2526-81', 'Orange Refractor', 11);
pushKnownSerial('tcb2526-81', 'Orange Refractor', 20);
// ...plus dieselbe Seriennummer 11/25 zusätzlich als eigene Autogramm-Version — genau das
// Mario-Götze-Beispiel: gleiche Auflage, aber zwei unterscheidbare physische Karten.
pushKnownSerial('tcb2526-81', 'Orange Refractor', 11, true);
// Die reale Karte, die der Nutzer besitzt: Mario Götze, Orange Refractor Autograph, 02/25
pushKnownSerial('tcb2526-101', 'Orange Refractor', 2, true);

const setById = (id) => SETS.find((s) => s.id === id);

const MY_OWNED = [
  { id: 'tcb2526-84-goldrefractor-12', cond: 'PSA 10', price: 45, estValue: 68, sellPrice: 60, isPublic: true },
  { id: 'tcb2526-82-superfractor-1', cond: 'PSA 9', price: 38, estValue: 210, sellPrice: null, isPublic: true },
  { id: 'tcb2526-18-redrefractor-2', cond: 'Roh / ungeprüft', price: 6, estValue: 9, sellPrice: null, isPublic: true },
  { id: 'tcb2526-59-greenrefractor-34', cond: 'PSA 9', price: 12, estValue: 15, sellPrice: 20, isPublic: true },
  { id: 'tcb2526-81-orangerefractor-11', cond: 'Roh / ungeprüft', price: 5, estValue: 6, sellPrice: null, isPublic: true },
  { id: 'tcb2526-81-orangerefractor-20', cond: 'PSA 8', price: 7, estValue: 8, sellPrice: null, isPublic: true },
  { id: 'tcb2526-81-orangerefractor-11-auto', cond: 'PSA 9', price: 65, estValue: 95, sellPrice: null, isPublic: true },
  { id: 'tcb2526-101-orangerefractor-2-auto', cond: 'Roh / ungeprüft', price: 0, estValue: 0, sellPrice: null, isPublic: true },
  { id: 'tcb2526-96-purplerefractor-41', cond: 'Roh / ungeprüft', price: 3, estValue: 3, sellPrice: null, isPublic: true },
  { id: 'hk-auto-1', cond: 'PSA 10', price: 890, estValue: 1450, sellPrice: null, isPublic: false },
];

const OTHERS = [
  { id: 'u1', name: 'Fabian K.', club: 'Borussia Dortmund', city: 'Dortmund', owned: ['tcb2526-16', 'tcb2526-17', 'tcb2526-19', 'tcb2526-20', 'tcb2526-21', 'hk-auto-3'] },
  { id: 'u2', name: 'Sina M.', club: 'FC Bayern München', city: 'Schweinfurt', owned: ['tcb2526-79', 'tcb2526-80', 'tcb2526-81', 'tcb2526-83', 'hk-auto-12'] },
  { id: 'u3', name: 'Timo R.', club: 'RB Leipzig', city: 'Leipzig', owned: ['tcb2526-55', 'tcb2526-57', 'tcb2526-58', 'tcb2526-60', 'tcb2526-61', 'hk-auto-25'] },
  { id: 'u4', name: 'Jonas P.', club: 'FC Bayern München', city: 'Würzburg', owned: ['tcb2526-79', 'tcb2526-80', 'tcb2526-83', 'tcb2526-84', 'hk-auto-7'] },
  { id: 'u5', name: 'Miriam T.', club: 'Eintracht Frankfurt', city: 'Frankfurt am Main', owned: ['tcb2526-23', 'tcb2526-24', 'tcb2526-27', 'tcb2526-28', 'tcb2526-25'] },
];

// Formatiert Seriennummer/Auflage null-sicher — frisch generierte Parallelen kennen ihre
// gezogene Nummer noch nicht ("?"), bis der Nutzer sie beim Hinzufügen einträgt.
function formatSerial(entry) {
  const numPart = entry.num != null ? `#${String(entry.num).padStart(3, '0')}` : '#?';
  const printPart = entry.print != null ? `/${entry.print}` : '';
  return numPart + printPart;
}

function rarityStyle(rarity, auto) {
  if (auto || rarity.includes('SuperFractor') || rarity === 'FrozenFractor') {
    return { border: `2px solid ${C.gold}`, glow: true };
  }
  const family = Object.keys(PARALLEL_COLORS).find((key) => rarity.startsWith(key));
  if (family) return { border: `1.5px solid ${PARALLEL_COLORS[family]}`, glow: false };
  if (rarity.includes('Wave')) return { border: `1.5px solid ${C.blue}`, glow: false };
  if (['Electrified', 'Illumination', 'Ornaments', 'Ultrabeam', 'Wild Jungle', 'Club Logo', 'Black Spectrum Limited Edition', 'Helix', 'Shadow Etch', 'Anime', 'All-Etch Rookie Rush'].some((s) => rarity.startsWith(s))) {
    return { border: `1.5px dashed ${C.blue}`, glow: false };
  }
  return { border: `1.5px solid rgba(28,26,21,0.3)`, glow: false };
}

function stickerTilt(id) {
  // deterministic pseudo-random tilt so stickers look hand-placed, not uniform
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 997;
  return (h % 5) - 2; // -2deg .. 2deg
}

function Card({ entry, owned, onClick, photo }) {
  const club = CLUBS[entry.club];
  const rs = rarityStyle(entry.rarity, entry.auto);
  const tilt = stickerTilt(entry.id);
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col text-left rounded-md overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:rotate-0"
      style={{
        background: C.surface,
        border: rs.border,
        aspectRatio: '5/7',
        width: '100%',
        transform: `rotate(${tilt}deg)`,
        boxShadow: '2px 3px 6px rgba(28,26,21,0.25)',
      }}
    >
      {photo && (
        <img src={photo} alt={entry.player} className="absolute inset-0 w-full h-full object-cover" />
      )}
      {/* peeled corner */}
      <div
        className="absolute bottom-0 right-0 pointer-events-none"
        style={{
          width: 0,
          height: 0,
          borderStyle: 'solid',
          borderWidth: '0 0 14px 14px',
          borderColor: `transparent transparent ${C.bg} transparent`,
          filter: 'drop-shadow(-1px -1px 1px rgba(28,26,21,0.3))',
        }}
      />
      {rs.glow && (
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.7) 45%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0.7) 55%, transparent 70%)`,
            backgroundSize: '250% 250%',
            animation: 'shimmer 1.8s ease-in-out infinite',
          }}
        />
      )}
      {!photo && (
        <>
          <div style={{ height: '8px', background: `linear-gradient(90deg, ${club.p}, ${club.s})` }} />
          <div className="flex-1 flex flex-col items-center justify-center px-2 gap-1">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: club.s, color: '#fff', border: `2px solid ${club.p}` }}
            >
              {(() => { const parts = entry.player.split(' '); return parts[parts.length - 1]?.[0] || 'X'; })()}
            </div>
            <div className="text-center leading-tight" style={{ color: C.ink, fontFamily: 'Bungee, sans-serif', fontSize: '12px', letterSpacing: '0.2px' }}>
              {entry.player}
            </div>
            <div className="text-[10px]" style={{ color: C.muted, fontFamily: 'Inter, sans-serif' }}>{entry.pos || entry.club.split(' ').slice(-1)[0]} · {entry.season}</div>
          </div>
        </>
      )}
      {owned && owned.isPublic === false && (
        <div
          className="absolute top-2 left-2 w-4 h-4 rounded-full flex items-center justify-center"
          style={{ background: C.ink, color: '#FFFCF2' }}
        >
          <Lock size={9} />
        </div>
      )}
      {entry.auto && (
        <div
          className="absolute top-2 right-2 px-1.5 py-0.5 rounded"
          style={{ background: C.red, color: '#FFFCF2', fontFamily: 'Bungee, sans-serif', fontSize: '7px', letterSpacing: '0.5px' }}
        >
          AUTO
        </div>
      )}
      {entry.rookie && !entry.auto && (
        <div
          className="absolute top-2 right-2 px-1.5 py-0.5 rounded"
          style={{ background: C.blue, color: '#FFFCF2', fontFamily: 'Bungee, sans-serif', fontSize: '7px', letterSpacing: '0.5px' }}
        >
          RC
        </div>
      )}
      {!photo && (
        <div className="text-center px-2" style={{ color: C.muted, fontFamily: 'Inter, sans-serif', fontSize: '9px' }}>
          {setById(entry.setId)?.name}
        </div>
      )}
      <div
        className="flex items-center justify-between px-2 py-1"
        style={
          photo
            ? { background: 'linear-gradient(to top, rgba(11,10,8,0.85), rgba(11,10,8,0.15))', fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', color: '#FFFCF2' }
            : { background: 'rgba(28,26,21,0.08)', fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', color: C.muted }
        }
      >
        <span>{formatSerial(entry)}</span>
        {owned && owned.price != null && <span style={{ color: C.gold }}>€{owned.price}</span>}
      </div>
    </button>
  );
}

function EmptySlot() {
  return (
    <div
      className="flex items-center justify-center rounded-md"
      style={{
        border: `2px dashed ${C.border}`,
        background: 'repeating-linear-gradient(135deg, rgba(28,26,21,0.03) 0px, rgba(28,26,21,0.03) 6px, transparent 6px, transparent 12px)',
        aspectRatio: '5/7',
        color: C.muted,
        fontFamily: 'Bungee, sans-serif',
        fontSize: '9px',
        letterSpacing: '0.5px',
      }}
    >
      FEHLT
    </div>
  );
}

function BinderPages({ entries, ownedMap, onCardClick, photos = {} }) {
  const pages = [];
  for (let i = 0; i < entries.length; i += 9) pages.push(entries.slice(i, i + 9));
  if (pages.length === 0) pages.push([]);
  return (
    <div className="flex flex-col gap-8">
      {pages.map((page, pi) => (
        <div
          key={pi}
          className="rounded-sm p-4"
          style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: '0 4px 10px rgba(28,26,21,0.12)' }}
        >
          <div
            className="flex items-center justify-between mb-4 px-3 py-1.5 rounded-sm"
            style={{
              background: `radial-gradient(rgba(28,26,21,0.14) 1px, transparent 1.4px)`,
              backgroundSize: '7px 7px',
              backgroundColor: C.bg,
              border: `1px solid ${C.border}`,
            }}
          >
            <span style={{ fontFamily: 'Bungee, sans-serif', color: C.ink, fontSize: '12px', letterSpacing: '1px' }}>SEITE {pi + 1}</span>
            <span style={{ fontFamily: '"IBM Plex Mono", monospace', color: C.muted, fontSize: '11px' }}>{page.length}/9</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {(() => {
              const slots = [...page];
              while (slots.length < 9) slots.push(null);
              return slots.map((entry, idx) =>
                entry ? (
                  <Card key={entry.id} entry={entry} owned={ownedMap[entry.id]} onClick={() => onCardClick(entry)} photo={photos[entry.id]?.front} />
                ) : (
                  <EmptySlot key={idx} />
                )
              );
            })()}
          </div>
        </div>
      ))}
    </div>
  );
}

const ACCENTS = ['#E4032E', '#0056A4', '#C9A227', '#8C7F5E'];

function StatPill({ label, value, index = 0, delta, isPrivate }) {
  return (
    <div className="relative overflow-hidden flex flex-col items-start px-4 py-2 rounded-sm" style={{ background: C.surfaceLight, border: `1px solid ${C.border}` }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: ACCENTS[index % ACCENTS.length] }} />
      <div className="flex items-center gap-1.5" style={{ marginTop: '2px' }}>
        <span style={{ fontFamily: 'Bungee, sans-serif', fontSize: '20px', color: C.ink }}>{value}</span>
        {delta != null && (
          <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', fontWeight: 600, color: delta >= 0 ? C.green : C.danger }}>
            {delta >= 0 ? '+' : ''}{delta}%
          </span>
        )}
      </div>
      <div className="flex items-center gap-1">
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: C.muted, letterSpacing: '0.3px' }}>{label}</span>
        {isPrivate && <Lock size={9} color={C.muted} />}
      </div>
    </div>
  );
}

function findOwner(cardId, ownedMap, othersList) {
  if (ownedMap[cardId]) return { name: 'Du', mine: true };
  const other = othersList.find((o) => o.owned.includes(cardId));
  return other ? { name: other.name, collector: other } : null;
}

function EditionMatrix({ group, ownedMap, othersList, onViewCollector }) {
  const rep = group[0];
  const total = rep.print;
  const byNum = Object.fromEntries(group.map((c) => [c.num, c]));
  return (
    <div className="rounded-sm p-4" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
      <div className="flex items-center gap-3 mb-4">
        <div style={{ width: '56px' }}>
          <Card entry={rep} owned={null} onClick={() => {}} />
        </div>
        <div>
          <div style={{ fontFamily: 'Bungee, sans-serif', fontSize: '13px', color: C.ink }}>{rep.player}</div>
          <div style={{ fontSize: '11px', color: C.muted }}>
            {setById(rep.setId)?.name}{rep.auto ? ' · Autograph' : ''} · Auflage 1/{total} – {total}/{total}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {Array.from({ length: total }, (_, i) => i + 1).map((num) => {
          const entry = byNum[num];
          const owner = entry ? findOwner(entry.id, ownedMap, othersList) : null;
          const clickable = owner && !owner.mine && owner.collector;
          return (
            <div
              key={num}
              onClick={() => clickable && onViewCollector(owner.collector)}
              className="flex flex-col items-center justify-center rounded-sm px-1 py-1.5"
              style={{
                background: owner ? (owner.mine ? C.gold : C.surfaceLight) : 'transparent',
                border: `1.5px ${owner ? 'solid' : 'dashed'} ${owner ? C.ink : C.border}`,
                cursor: clickable ? 'pointer' : 'default',
              }}
            >
              <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', color: C.ink }}>{num}/{total}</span>
              <span style={{ fontSize: '8px', color: C.muted, textAlign: 'center', lineHeight: 1.2 }}>{owner ? owner.name : 'unbekannt'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SimpleMatchRow({ entry, ownedMap, othersList, onViewCollector }) {
  const owner = findOwner(entry.id, ownedMap, othersList);
  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
      <div>
        <div style={{ color: C.ink, fontSize: '13px' }}>{entry.player} · {entry.club}</div>
        <div style={{ color: C.muted, fontSize: '11px' }}>
          {setById(entry.setId)?.name} · {formatSerial(entry)}{entry.auto ? ' · Autograph' : ''}
        </div>
      </div>
      {owner?.mine && <span style={{ color: C.gold, fontSize: '11px', fontWeight: 600 }}>In deiner Sammlung</span>}
      {owner && !owner.mine && (
        <button onClick={() => onViewCollector(owner.collector)} style={{ color: C.blue, fontSize: '11px', fontWeight: 600 }}>
          {owner.name} ansehen
        </button>
      )}
      {!owner && <span style={{ color: C.muted, fontSize: '11px' }}>Nicht erfasst</span>}
    </div>
  );
}


function ChecklistRow({ entry, checked, disabled, onToggle }) {
  const club = CLUBS[entry.club];
  return (
    <label
      className="flex items-center gap-2 px-2 py-1.5 rounded-md text-xs"
      style={{
        background: checked ? C.surfaceLight : 'transparent',
        border: `1px solid ${C.border}`,
        opacity: disabled ? 0.55 : 1,
        cursor: disabled ? 'default' : 'pointer',
      }}
    >
      <input type="checkbox" checked={checked} disabled={disabled} onChange={() => onToggle(entry)} />
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: club?.p || C.muted, flexShrink: 0 }} />
      <span style={{ fontFamily: '"IBM Plex Mono", monospace', color: C.muted, width: '48px', flexShrink: 0 }}>
        {entry.print > 1 && entry.baseNum != null && entry.num != null
          ? `${entry.num}/${entry.print}`
          : `#${String(entry.baseNum ?? entry.num).padStart(3, '0')}`}
      </span>
      <span style={{ color: C.ink, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.player}</span>
      {entry.auto && (
        <span className="px-1.5 py-0.5 rounded" style={{ background: C.red, color: '#FFFCF2', fontFamily: 'Bungee, sans-serif', fontSize: '8px', flexShrink: 0 }}>
          AUTO
        </span>
      )}
      {entry.rarity !== 'Base' && <span style={{ color: C.muted, fontSize: '10px', flexShrink: 0 }}>{entry.rarity}</span>}
      {disabled && <span style={{ color: C.green, fontSize: '10px', flexShrink: 0 }}>✓ besitzt du</span>}
    </label>
  );
}

function CollectorRow({ u, badge, onClick, myCity }) {
  const sameCity = myCity && u.city && u.city.toLowerCase() === myCity.toLowerCase();
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between flex-wrap gap-2 px-4 py-3 rounded-xl transition-colors hover:brightness-95 w-full"
      style={{ background: C.surface, border: `1px solid ${C.border}` }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: C.surfaceLight, color: C.ink, fontFamily: 'Bungee, sans-serif', fontSize: '13px', border: `1px solid ${C.border}` }}
        >
          {u.name[0]}
        </div>
        <div className="text-left min-w-0">
          <div style={{ color: C.ink, fontSize: '13px', fontWeight: 600 }}>{u.name}</div>
          <div style={{ color: C.muted, fontSize: '11px' }} className="truncate">Fan von {u.club}{u.city ? ` · ${u.city}` : ''}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {sameCity && (
          <span
            className="px-2 py-1 rounded-full flex items-center gap-1"
            style={{ background: C.green, color: '#FFFCF2', fontFamily: 'Bungee, sans-serif', fontSize: '9px', letterSpacing: '0.3px' }}
          >
            <MapPin size={9} /> GLEICHE STADT
          </span>
        )}
        {badge && (
          <span
            className="px-2 py-1 rounded-full"
            style={{ background: badge.color, color: '#FFFCF2', fontFamily: 'Bungee, sans-serif', fontSize: '9px', letterSpacing: '0.3px' }}
          >
            {badge.text}
          </span>
        )}
        <span style={{ fontFamily: '"IBM Plex Mono", monospace', color: C.green, fontSize: '12px' }}>{u.owned.length} Karten</span>
      </div>
    </button>
  );
}

export default function KartenboxPrototype() {
  const [view, setView] = useState('sammlung');
  const [profile, setProfile] = useState({
    firstName: 'Luca',
    lastName: 'Dahms',
    username: 'CardCollector92',
    city: 'Schweinfurt',
    favoriteClub: 'SpVgg Greuther Fürth',
    bio: '',
    isPublic: true,
    showRealName: false,
  });
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [selectedCollector, setSelectedCollector] = useState(null);
  const [owned, setOwned] = useState(MY_OWNED);
  const [photos, setPhotos] = useState({});

  function handlePhotoCapture(cardId, side, file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhotos((prev) => ({ ...prev, [cardId]: { ...prev[cardId], [side]: reader.result } }));
    };
    reader.readAsDataURL(file);
  }

  function removePhoto(cardId, side) {
    setPhotos((prev) => ({ ...prev, [cardId]: { ...prev[cardId], [side]: null } }));
  }
  const [filterClub, setFilterClub] = useState('Alle');
  const [filterRarity, setFilterRarity] = useState('Alle');
  const [filterSet, setFilterSet] = useState('Alle');
  const [search, setSearch] = useState('');
  const [wantQuery, setWantQuery] = useState('');
  const [addMode, setAddMode] = useState('einzeln');
  const [bulkSetId, setBulkSetId] = useState(SETS[0].id);
  const [bulkRarity, setBulkRarity] = useState('Base');
  const [bulkPlayerSearch, setBulkPlayerSearch] = useState('');
  const [bulkAuto, setBulkAuto] = useState('ohne');
  const [bulkSelected, setBulkSelected] = useState({});
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [addForm, setAddForm] = useState({ player: '', season: '2025/26', setId: SETS[0].id, rarity: 'Base', serialNum: '', serialTotal: '', auto: false, price: '', sellPrice: '', isPublic: true });
  const detectedClub = useMemo(() => {
    const match = CATALOGUE.find((c) => c.player.toLowerCase() === addForm.player.trim().toLowerCase());
    return match?.club || '';
  }, [addForm.player]);

  const ownedMap = useMemo(() => Object.fromEntries(owned.map((o) => [o.id, o])), [owned]);
  const myEntries = useMemo(
    () => CATALOGUE.filter((c) => ownedMap[c.id])
      .filter((c) => filterClub === 'Alle' || c.club === filterClub)
      .filter((c) => filterRarity === 'Alle' || c.rarity.includes(filterRarity))
      .filter((c) => filterSet === 'Alle' || c.setId === filterSet),
    [ownedMap, filterClub, filterRarity, filterSet]
  );

  const totalPurchase = owned.reduce((sum, o) => sum + (Number(o.price) || 0), 0);
  const totalEstValue = owned.reduce((sum, o) => sum + (Number(o.estValue ?? o.price) || 0), 0);
  const growthPercent = totalPurchase > 0 ? Math.round(((totalEstValue - totalPurchase) / totalPurchase) * 100) : 0;
  const completion = Math.round((owned.length / CATALOGUE.length) * 100);

  const missingIds = useMemo(() => CATALOGUE.filter((c) => !ownedMap[c.id]).map((c) => c.id), [ownedMap]);

  const topMatches = useMemo(() => {
    return OTHERS.map((o) => ({ ...o, matchCount: o.owned.filter((id) => missingIds.includes(id)).length }))
      .filter((o) => o.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount)
      .slice(0, 2);
  }, [missingIds]);

  const randomPicks = useMemo(() => {
    const excludeIds = topMatches.map((o) => o.id);
    const pool = OTHERS.filter((o) => !excludeIds.includes(o.id));
    const arr = [...pool];
    let seed = shuffleSeed * 7919 + 13;
    for (let i = arr.length - 1; i > 0; i--) {
      seed = (seed * 9301 + 49297) % 233280;
      const j = Math.floor((seed / 233280) * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, 2);
  }, [shuffleSeed, topMatches]);

  const wantGroups = useMemo(() => {
    if (!wantQuery.trim()) return [];
    const tokens = wantQuery.toLowerCase().split(/\s+/).filter(Boolean);
    const matches = CATALOGUE.filter((c) => {
      const set = setById(c.setId);
      const hay = `${c.player} ${c.club} ${set?.name} ${set?.manufacturer} ${c.rarity} ${c.season} ${c.auto ? 'autograph auto' : ''}`.toLowerCase();
      return tokens.every((t) => hay.includes(t));
    });
    const map = {};
    matches.forEach((c) => {
      const key = `${c.player}|${c.setId}|${c.rarity}|${c.auto}`;
      (map[key] ||= []).push(c);
    });
    return Object.values(map);
  }, [wantQuery]);

  function viewCollector(collector) {
    setView('entdecken');
    setSelectedCollector(collector);
  }

  const bulkList = useMemo(() => {
    const q = bulkPlayerSearch.trim().toLowerCase();
    const baseMatches = BASE_CARDS.filter((c) => c.setId === bulkSetId && (!q || c.player.toLowerCase().includes(q)));
    const autoFlags = bulkAuto === 'beide' ? [false, true] : [bulkAuto === 'mit'];

    if (bulkRarity === 'Base') {
      const rows = [];
      baseMatches.forEach((c) => {
        autoFlags.forEach((auto) => rows.push({ ...c, id: auto ? `${c.id}-auto` : c.id, auto }));
      });
      return rows.sort((a, b) => a.num - b.num);
    }

    const tier = REFRACTOR_TIERS.find((t) => t.name === bulkRarity);
    if (!tier) {
      // Wave Refractor, Insert-Sets, Autograph, 'Alle': noch nicht systematisch generiert —
      // zeige, was dafür schon real im Katalog existiert (z. B. Autogramm-Serie, manuelle Karten).
      return CATALOGUE
        .filter((c) => c.setId === bulkSetId && (bulkRarity === 'Alle' || c.rarity === bulkRarity) && (!q || c.player.toLowerCase().includes(q)))
        .filter((c) => bulkAuto === 'beide' || c.auto === (bulkAuto === 'mit'))
        .sort((a, b) => (a.num || 0) - (b.num || 0));
    }

    const slug = tier.name.replace(/\s+/g, '').toLowerCase();
    const expandSerials = tier.print > 1 && q.length > 0;

    if (!expandSerials) {
      // Übersicht: eine Zeile pro Spieler (und Autogramm-Variante), Seriennummer noch offen
      const rows = [];
      baseMatches.forEach((c) => {
        autoFlags.forEach((auto) => {
          const id = `${c.id}-${slug}${auto ? '-auto' : ''}`;
          rows.push({ ...c, id, rarity: tier.name, num: tier.print === 1 ? 1 : null, baseNum: c.num, print: tier.print, auto });
        });
      });
      return rows;
    }

    // Auf einen Spieler eingegrenzt + nummerierte Parallele -> alle Exemplare 1..N einzeln,
    // je Autogramm-Variante als eigene, unterscheidbare Karte
    const rows = [];
    baseMatches.forEach((c) => {
      for (let n = 1; n <= tier.print; n++) {
        autoFlags.forEach((auto) => {
          const id = `${c.id}-${slug}-${n}${auto ? '-auto' : ''}`;
          rows.push({ ...c, id, rarity: tier.name, num: n, baseNum: c.num, print: tier.print, auto });
        });
      }
    });
    return rows;
  }, [bulkSetId, bulkRarity, bulkPlayerSearch, bulkAuto]);
  const bulkSelectedCount = Object.keys(bulkSelected).length;

  function toggleBulk(entry) {
    setBulkSelected((prev) => {
      const next = { ...prev };
      if (next[entry.id]) delete next[entry.id];
      else next[entry.id] = entry;
      return next;
    });
  }

  function selectAllVisible() {
    setBulkSelected((prev) => {
      const next = { ...prev };
      bulkList.forEach((c) => { if (!ownedMap[c.id]) next[c.id] = c; });
      return next;
    });
  }

  function deselectAllVisible() {
    setBulkSelected((prev) => {
      const next = { ...prev };
      bulkList.forEach((c) => { delete next[c.id]; });
      return next;
    });
  }

  function submitBulkUpload() {
    const toAdd = Object.values(bulkSelected).filter((c) => !ownedMap[c.id]);
    if (toAdd.length === 0) return;
    toAdd.forEach((c) => {
      if (!CATALOGUE.find((existing) => existing.id === c.id)) CATALOGUE.push(c);
    });
    setOwned((prev) => [
      ...prev,
      ...toAdd.map((c) => ({ id: c.id, cond: 'Roh / ungeprüft', price: 0, estValue: 0, sellPrice: null, isPublic: true })),
    ]);
    setBulkSelected({});
  }

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return CATALOGUE.filter((c) => {
      const set = setById(c.setId);
      return (
        c.player.toLowerCase().includes(q) ||
        c.club.toLowerCase().includes(q) ||
        set?.name.toLowerCase().includes(q) ||
        set?.manufacturer.toLowerCase().includes(q)
      );
    });
  }, [search]);

  function addToCollection(entry, price) {
    if (ownedMap[entry.id]) return;
    setOwned((prev) => [...prev, { id: entry.id, cond: 'Roh / ungeprüft', price: Number(price) || 0, estValue: Number(price) || 0, sellPrice: null, isPublic: true }]);
  }

  function removeFromCollection(id) {
    setOwned((prev) => prev.filter((o) => o.id !== id));
    setSelectedEntry(null);
  }

  function togglePublic(id) {
    setOwned((prev) => prev.map((o) => (o.id === id ? { ...o, isPublic: !o.isPublic } : o)));
  }

  function updateSellPrice(id, value) {
    setOwned((prev) => prev.map((o) => (o.id === id ? { ...o, sellPrice: value === '' ? null : Number(value) } : o)));
  }

  function updateSerialNum(id, value) {
    const entry = CATALOGUE.find((c) => c.id === id);
    if (!entry) return;
    entry.num = value === '' ? null : Number(value);
    setSelectedEntry((prev) => (prev && prev.id === id ? { ...prev, num: entry.num } : prev));
  }

  const clubOptions = ['Alle', ...Object.keys(CLUBS)];
  const rarityOptions = ['Alle', ...RARITY_ORDER];

  return (
    <div style={{ background: C.bg, minHeight: '100%', fontFamily: 'Inter, sans-serif' }} className="w-full">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bungee&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        @keyframes shimmer { 0% { background-position: 0% 0%; } 100% { background-position: 100% 100%; } }
        button { cursor: pointer; }
        select, input { outline: none; }
      `}</style>

      {/* Nav */}
      <div className="flex items-center justify-between gap-2 px-3 sm:px-5 py-3 flex-wrap" style={{ borderBottom: `1px solid #E4D5A8`, background: C.bg }}>
        <div className="flex items-center gap-2">
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, #fff, ${C.ink} 75%)`, border: `1.5px solid ${C.ink}` }} />
          <span style={{ fontFamily: 'Bungee, sans-serif', fontSize: '18px', letterSpacing: '0.5px' }} className="sm:text-xl">
            <span style={{ color: C.red }}>KARTEN</span><span style={{ color: C.blue }}>BOX</span>
          </span>
        </div>
        <div className="flex items-center gap-1 rounded-full p-1 overflow-x-auto" style={{ background: C.surfaceLight, maxWidth: '100%' }}>
          {[
            { key: 'sammlung', label: 'Meine Sammlung', icon: LayoutGrid },
            { key: 'entdecken', label: 'Entdecken', icon: Users },
            { key: 'hinzufuegen', label: 'Karte hinzufügen', icon: Plus },
            { key: 'profil', label: 'Profil', icon: User },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { setView(key); setSelectedCollector(null); }}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full transition-colors flex-shrink-0"
              style={{
                background: view === key ? C.blue : 'transparent',
                color: view === key ? '#FFFCF2' : C.muted,
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <Icon size={15} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
        <button
          onClick={() => { setView('profil'); setSelectedCollector(null); }}
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: C.gold, color: C.ink, fontFamily: 'Bungee, sans-serif', fontSize: '12px', border: `1.5px solid ${C.ink}` }}
        >
          {(profile.firstName[0] || '') + (profile.lastName[0] || '')}
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-3 sm:px-5 py-6">
        {view === 'sammlung' && (
          <>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <StatPill index={0} label="KARTEN GESAMT" value={owned.length} />
              <StatPill index={1} label="SET KOMPLETT" value={`${completion}%`} />
              <StatPill index={2} label="GESCHÄTZTER WERT" value={`€${totalEstValue}`} delta={growthPercent} />
              <StatPill index={3} label="ANKAUFSSUMME" value={`€${totalPurchase}`} isPrivate />
            </div>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <select
                value={filterClub}
                onChange={(e) => setFilterClub(e.target.value)}
                className="rounded-lg px-3 py-1.5 text-xs"
                style={{ background: C.surfaceLight, color: C.ink, border: '1px solid #DFC98D' }}
              >
                {clubOptions.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                value={filterRarity}
                onChange={(e) => setFilterRarity(e.target.value)}
                className="rounded-lg px-3 py-1.5 text-xs"
                style={{ background: C.surfaceLight, color: C.ink, border: '1px solid #DFC98D' }}
              >
                {rarityOptions.map((r) => <option key={r} value={r}>{r === 'Alle' ? 'Alle Seltenheiten' : r}</option>)}
              </select>
              <select
                value={filterSet}
                onChange={(e) => setFilterSet(e.target.value)}
                className="rounded-lg px-3 py-1.5 text-xs"
                style={{ background: C.surfaceLight, color: C.ink, border: '1px solid #DFC98D' }}
              >
                <option value="Alle">Alle Sets</option>
                {SETS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              {(filterClub !== 'Alle' || filterRarity !== 'Alle' || filterSet !== 'Alle') && (
                <button
                  onClick={() => { setFilterClub('Alle'); setFilterRarity('Alle'); setFilterSet('Alle'); }}
                  className="text-xs px-2 py-1"
                  style={{ color: C.muted }}
                >
                  Zurücksetzen
                </button>
              )}
            </div>
            <BinderPages entries={myEntries} ownedMap={ownedMap} onCardClick={setSelectedEntry} photos={photos} />
          </>
        )}

        {view === 'entdecken' && !selectedCollector && (
          <div className="flex flex-col gap-8">
            {topMatches.length > 0 && (
              <div className="flex flex-col gap-3">
                <h2 style={{ fontFamily: 'Bungee, sans-serif', color: C.ink, fontSize: '16px', letterSpacing: '0.5px' }}>FÜR DICH INTERESSANT</h2>
                {topMatches.map((u) => (
                  <CollectorRow
                    key={u.id}
                    u={u}
                    myCity={profile.city}
                    badge={{ text: `${u.matchCount} FEHLEN DIR`, color: C.red }}
                    onClick={() => setSelectedCollector(u)}
                  />
                ))}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 style={{ fontFamily: 'Bungee, sans-serif', color: C.ink, fontSize: '16px', letterSpacing: '0.5px' }}>ZUFÄLLIG ENTDECKEN</h2>
                <button onClick={() => setShuffleSeed((s) => s + 1)} style={{ color: C.blue, fontSize: '11px', fontWeight: 600 }}>
                  🔀 Andere Vorschläge
                </button>
              </div>
              {randomPicks.map((u) => (
                <CollectorRow key={u.id} u={u} myCity={profile.city} badge={{ text: 'SPANNENDE SAMMLUNG', color: C.blue }} onClick={() => setSelectedCollector(u)} />
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <h2 style={{ fontFamily: 'Bungee, sans-serif', color: C.ink, fontSize: '16px', letterSpacing: '0.5px' }}>KARTE SUCHEN, DIE DU BRAUCHST</h2>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: C.surfaceLight, border: `1px solid ${C.border}` }}>
                <Search size={14} color={C.muted} />
                <input
                  value={wantQuery}
                  onChange={(e) => setWantQuery(e.target.value)}
                  placeholder="z. B. Topps Chrome Bundesliga 25/26 Harry Kane Autograph"
                  className="bg-transparent flex-1 text-sm"
                  style={{ color: C.ink }}
                />
              </div>
              {wantQuery.trim() && wantGroups.length === 0 && (
                <div style={{ color: C.muted, fontSize: '12px' }}>Keine passende Karte im Katalog gefunden.</div>
              )}
              {wantGroups.map((group, gi) =>
                group[0].print > 1 ? (
                  <EditionMatrix key={gi} group={group} ownedMap={ownedMap} othersList={OTHERS} onViewCollector={viewCollector} />
                ) : (
                  <SimpleMatchRow key={gi} entry={group[0]} ownedMap={ownedMap} othersList={OTHERS} onViewCollector={viewCollector} />
                )
              )}
            </div>

            <div className="flex flex-col gap-3 pt-2" style={{ borderTop: `1px solid ${C.border}` }}>
              <h2 style={{ fontFamily: 'Bungee, sans-serif', color: C.ink, fontSize: '16px', letterSpacing: '0.5px', marginTop: '16px' }}>ALLE SAMMLER</h2>
              {OTHERS.map((u) => (
                <CollectorRow key={u.id} u={u} myCity={profile.city} onClick={() => setSelectedCollector(u)} />
              ))}
            </div>
          </div>
        )}

        {view === 'entdecken' && selectedCollector && (
          <>
            <button
              onClick={() => setSelectedCollector(null)}
              className="flex items-center gap-1 mb-4 text-xs"
              style={{ color: C.muted }}
            >
              <ChevronLeft size={14} /> Zurück zu Sammlern
            </button>
            <h2 style={{ fontFamily: 'Bungee, sans-serif', color: C.ink, fontSize: '18px', marginBottom: '16px' }}>
              SAMMLUNG VON {selectedCollector.name.toUpperCase()}
            </h2>
            <BinderPages
              entries={CATALOGUE.filter((c) => selectedCollector.owned.includes(c.id))}
              ownedMap={{}}
              onCardClick={setSelectedEntry}
            />
          </>
        )}

        {view === 'hinzufuegen' && (
          <div className="flex flex-col gap-5 max-w-lg">
            <div className="flex items-center gap-1 rounded-full p-1 w-fit flex-wrap" style={{ background: C.surfaceLight, border: `1px solid ${C.border}` }}>
              {[
                { key: 'einzeln', label: 'Einzeln hinzufügen' },
                { key: 'checkliste', label: 'Ganzes Set abhaken' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setAddMode(key)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ background: addMode === key ? C.blue : 'transparent', color: addMode === key ? '#FFFCF2' : C.muted }}
                >
                  {label}
                </button>
              ))}
            </div>

            {addMode === 'einzeln' && (
              <div className="flex flex-col gap-6">
                <div>
                  <label style={{ color: C.muted, fontSize: '11px' }}>Spieler oder Verein suchen</label>
                  <div className="flex items-center gap-2 mt-1 px-3 py-2 rounded-lg" style={{ background: C.surfaceLight, border: '1px solid #DFC98D' }}>
                    <Search size={14} color={C.muted} />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="z. B. Wagner oder Fürth"
                      className="bg-transparent flex-1 text-sm"
                      style={{ color: C.ink }}
                    />
                  </div>
                </div>

                {searchResults.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {searchResults.map((r) => (
                      <div key={r.id} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: C.surface, border: '1px solid #E8D9A6' }}>
                        <div>
                          <div style={{ color: C.ink, fontSize: '13px' }}>{r.player} · {r.club}</div>
                          <div style={{ color: C.muted, fontSize: '11px' }}>
                            {setById(r.setId)?.name} · {formatSerial(r)}{r.auto ? ' · Autograph' : ''}
                          </div>
                        </div>
                        {ownedMap[r.id] ? (
                          <span style={{ color: C.green, fontSize: '11px' }}>Bereits in Sammlung</span>
                        ) : (
                          <button
                            onClick={() => addToCollection(r, 0)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold"
                        style={{ background: C.green, color: C.ink }}
                      >
                        <Plus size={12} /> Hinzufügen
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {search.trim() && searchResults.length === 0 && (
              <div style={{ color: C.muted, fontSize: '12px' }}>Keine Treffer im Katalog. Lege die Karte manuell an:</div>
            )}

            <div className="pt-2" style={{ borderTop: '1px solid #E8D9A6' }}>
              <div style={{ color: C.ink, fontFamily: 'Bungee, sans-serif', fontSize: '14px', marginBottom: '10px', marginTop: '14px' }}>
                MANUELL ANLEGEN
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Spielername"
                  value={addForm.player}
                  onChange={(e) => setAddForm({ ...addForm, player: e.target.value })}
                  className="px-3 py-2 rounded-lg text-sm col-span-2"
                  style={{ background: C.surfaceLight, color: C.ink, border: '1px solid #DFC98D' }}
                />
                <div
                  className="flex items-center px-3 py-2 rounded-lg text-sm col-span-2"
                  style={{ background: C.surface, border: `1px dashed ${C.border}`, color: detectedClub ? C.ink : C.muted }}
                >
                  {detectedClub ? `Verein: ${detectedClub}` : 'Verein wird automatisch anhand des Spielernamens erkannt'}
                </div>
                <select
                  value={addForm.setId}
                  onChange={(e) => setAddForm({ ...addForm, setId: e.target.value })}
                  className="px-3 py-2 rounded-lg text-sm col-span-2"
                  style={{ background: C.surfaceLight, color: C.ink, border: '1px solid #DFC98D' }}
                >
                  {SETS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <select
                  value={addForm.rarity}
                  onChange={(e) => {
                    const r = e.target.value;
                    const fixed = FIXED_PRINT_RUNS[r];
                    setAddForm({
                      ...addForm,
                      rarity: r,
                      serialTotal: fixed ? String(fixed) : '',
                      serialNum: r === 'SuperFractor' ? '1' : '',
                    });
                  }}
                  className="px-3 py-2 rounded-lg text-sm col-span-2"
                  style={{ background: C.surfaceLight, color: C.ink, border: '1px solid #DFC98D' }}
                >
                  {RARITY_ORDER.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                {addForm.rarity !== 'Base' && (
                  <div className="col-span-2 flex items-end gap-2">
                    <div className="flex-1">
                      <label style={{ color: C.muted, fontSize: '10px' }}>Seriennummer</label>
                      <input
                        type="number"
                        min="1"
                        value={addForm.serialNum}
                        disabled={addForm.rarity === 'SuperFractor'}
                        onChange={(e) => setAddForm({ ...addForm, serialNum: e.target.value })}
                        placeholder="z. B. 21"
                        className="w-full px-3 py-2 rounded-lg text-sm mt-1"
                        style={{ background: C.surfaceLight, color: C.ink, border: '1px solid #DFC98D' }}
                      />
                    </div>
                    <span style={{ color: C.muted, paddingBottom: '10px' }}>/</span>
                    <div className="flex-1">
                      <label style={{ color: C.muted, fontSize: '10px' }}>Gesamtauflage</label>
                      <input
                        type="number"
                        min="1"
                        value={addForm.serialTotal}
                        disabled={!!FIXED_PRINT_RUNS[addForm.rarity]}
                        onChange={(e) => setAddForm({ ...addForm, serialTotal: e.target.value })}
                        placeholder="z. B. 50"
                        className="w-full px-3 py-2 rounded-lg text-sm mt-1"
                        style={{ background: C.surfaceLight, color: C.ink, border: '1px solid #DFC98D', opacity: FIXED_PRINT_RUNS[addForm.rarity] ? 0.7 : 1 }}
                      />
                    </div>
                  </div>
                )}
                <input
                  placeholder="Ankaufspreis (€)"
                  value={addForm.price}
                  onChange={(e) => setAddForm({ ...addForm, price: e.target.value })}
                  className="px-3 py-2 rounded-lg text-sm"
                  style={{ background: C.surfaceLight, color: C.ink, border: '1px solid #DFC98D' }}
                />
                <input
                  placeholder="Gewünschter Verkaufspreis (€)"
                  value={addForm.sellPrice}
                  onChange={(e) => setAddForm({ ...addForm, sellPrice: e.target.value })}
                  className="px-3 py-2 rounded-lg text-sm"
                  style={{ background: C.surfaceLight, color: C.ink, border: '1px solid #DFC98D' }}
                />
                <label className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm" style={{ background: C.surfaceLight, color: C.ink, border: '1px solid #DFC98D' }}>
                  <input
                    type="checkbox"
                    checked={addForm.auto}
                    onChange={(e) => setAddForm({ ...addForm, auto: e.target.checked })}
                  />
                  Autograph
                </label>
                <label className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm" style={{ background: C.surfaceLight, color: C.ink, border: '1px solid #DFC98D' }}>
                  <input
                    type="checkbox"
                    checked={addForm.isPublic}
                    onChange={(e) => setAddForm({ ...addForm, isPublic: e.target.checked })}
                  />
                  Öffentlich sichtbar
                </label>
              </div>
              {!addForm.isPublic && (
                <div className="mt-2 flex items-center gap-1.5" style={{ color: C.muted, fontSize: '11px' }}>
                  <Lock size={12} /> Nur du siehst diese Karte — sie taucht bei anderen Sammlern nicht auf.
                </div>
              )}
              <button
                disabled={!addForm.player.trim()}
                onClick={() => {
                  const id = 'custom-' + Date.now();
                  const isBase = addForm.rarity === 'Base';
                  const num = isBase ? CATALOGUE.length + 1 : (Number(addForm.serialNum) || 1);
                  const print = isBase ? 100 : (Number(addForm.serialTotal) || FIXED_PRINT_RUNS[addForm.rarity] || 1);
                  CATALOGUE.push({ id, player: addForm.player, club: detectedClub || 'Unbekannter Verein', pos: '', season: addForm.season, setId: addForm.setId, rarity: addForm.rarity, num, print, auto: addForm.auto });
                  setOwned((prev) => [...prev, { id, cond: 'Roh / ungeprüft', price: Number(addForm.price) || 0, estValue: Number(addForm.price) || 0, sellPrice: addForm.sellPrice === '' ? null : Number(addForm.sellPrice), isPublic: addForm.isPublic }]);
                  setAddForm({ player: '', season: '2025/26', setId: SETS[0].id, rarity: 'Base', serialNum: '', serialTotal: '', auto: false, price: '', sellPrice: '', isPublic: true });
                  setSearch('');
                }}
                className="mt-3 w-full py-2 rounded-lg text-sm font-semibold"
                style={{ background: addForm.player.trim() ? C.gold : '#DFC98D', color: addForm.player.trim() ? C.ink : C.muted }}
              >
                Karte zur Sammlung hinzufügen
              </button>
            </div>
              </div>
            )}

            {addMode === 'checkliste' && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <select
                    value={bulkSetId}
                    onChange={(e) => setBulkSetId(e.target.value)}
                    className="px-3 py-2 rounded-lg text-sm flex-1"
                    style={{ background: C.surfaceLight, color: C.ink, border: `1px solid ${C.border}` }}
                  >
                    {SETS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  <select
                    value={bulkRarity}
                    onChange={(e) => setBulkRarity(e.target.value)}
                    className="px-3 py-2 rounded-lg text-sm"
                    style={{ background: C.surfaceLight, color: C.ink, border: `1px solid ${C.border}` }}
                  >
                    <option value="Alle">Alle Seltenheiten</option>
                    {RARITY_ORDER.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: C.surfaceLight, border: `1px solid ${C.border}` }}>
                  <Search size={14} color={C.muted} />
                  <input
                    value={bulkPlayerSearch}
                    onChange={(e) => setBulkPlayerSearch(e.target.value)}
                    placeholder="Nach Spieler filtern, z. B. Musiala"
                    className="bg-transparent flex-1 text-sm"
                    style={{ color: C.ink }}
                  />
                </div>

                <div className="flex items-center gap-1 rounded-full p-1 w-fit flex-wrap" style={{ background: C.surfaceLight, border: `1px solid ${C.border}` }}>
                  {[
                    { key: 'ohne', label: 'Ohne Autogramm' },
                    { key: 'mit', label: 'Mit Autogramm' },
                    { key: 'beide', label: 'Beide zeigen' },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setBulkAuto(key)}
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{ background: bulkAuto === key ? C.red : 'transparent', color: bulkAuto === key ? '#FFFCF2' : C.muted }}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {REFRACTOR_TIERS.find((t) => t.name === bulkRarity)?.print > 1 && !bulkPlayerSearch.trim() && (
                  <div style={{ color: C.muted, fontSize: '10px', marginTop: '-6px' }}>
                    Tipp: Spieler suchen, um alle {REFRACTOR_TIERS.find((t) => t.name === bulkRarity)?.print} einzelnen Exemplare (1/{REFRACTOR_TIERS.find((t) => t.name === bulkRarity)?.print} – {REFRACTOR_TIERS.find((t) => t.name === bulkRarity)?.print}/{REFRACTOR_TIERS.find((t) => t.name === bulkRarity)?.print}) einzeln abzuhaken.
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span style={{ color: C.muted, fontSize: '11px' }}>{bulkList.length} Karten in dieser Auswahl</span>
                  <div className="flex items-center gap-3">
                    <button onClick={selectAllVisible} style={{ color: C.blue, fontSize: '11px', fontWeight: 600 }}>Alle auswählen</button>
                    <button onClick={deselectAllVisible} style={{ color: C.muted, fontSize: '11px', fontWeight: 600 }}>Auswahl leeren</button>
                  </div>
                </div>

                <div className="flex flex-col gap-1 overflow-y-auto pr-1" style={{ maxHeight: '420px' }}>
                  {bulkList.map((entry) => (
                    <ChecklistRow
                      key={entry.id}
                      entry={entry}
                      checked={!!bulkSelected[entry.id] || !!ownedMap[entry.id]}
                      disabled={!!ownedMap[entry.id]}
                      onToggle={toggleBulk}
                    />
                  ))}
                  {bulkList.length === 0 && (
                    <div style={{ color: C.muted, fontSize: '12px', padding: '8px 0' }}>Keine Karten für diese Kombination aus Set und Seltenheit.</div>
                  )}
                </div>

                <div
                  className="sticky bottom-0 flex items-center justify-between px-4 py-3 rounded-lg mt-1"
                  style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: '0 -2px 8px rgba(28,26,21,0.08)' }}
                >
                  <span style={{ color: C.ink, fontSize: '12px', fontWeight: 600 }}>{bulkSelectedCount} ausgewählt</span>
                  <button
                    disabled={bulkSelectedCount === 0}
                    onClick={submitBulkUpload}
                    className="px-4 py-2 rounded-lg text-xs font-semibold"
                    style={{ background: bulkSelectedCount > 0 ? C.gold : C.border, color: bulkSelectedCount > 0 ? C.ink : C.muted }}
                  >
                    {bulkSelectedCount > 0 ? `${bulkSelectedCount} Karten hinzufügen` : 'Karten hinzufügen'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'profil' && (
          <div className="flex flex-col gap-6 max-w-lg">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: C.gold, color: C.ink, fontFamily: 'Bungee, sans-serif', fontSize: '22px', border: `2px solid ${C.ink}` }}
              >
                {(profile.firstName[0] || '') + (profile.lastName[0] || '')}
              </div>
              <div>
                <div style={{ fontFamily: 'Bungee, sans-serif', color: C.ink, fontSize: '16px' }}>
                  @{profile.username || 'nutzername'}
                </div>
                <div className="flex items-center gap-1.5" style={{ color: C.muted, fontSize: '12px' }}>
                  {profile.firstName} {profile.lastName}
                  {!profile.showRealName && (
                    <span className="flex items-center gap-1"><Lock size={10} /> nur für dich sichtbar</span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div style={{ color: C.ink, fontFamily: 'Bungee, sans-serif', fontSize: '13px', marginBottom: '10px' }}>PERSÖNLICHE ANGABEN</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ color: C.muted, fontSize: '10px' }}>Vorname</label>
                  <input
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-sm mt-1"
                    style={{ background: C.surfaceLight, color: C.ink, border: `1px solid ${C.border}` }}
                  />
                </div>
                <div>
                  <label style={{ color: C.muted, fontSize: '10px' }}>Nachname</label>
                  <input
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-sm mt-1"
                    style={{ background: C.surfaceLight, color: C.ink, border: `1px solid ${C.border}` }}
                  />
                </div>
                <div className="col-span-2">
                  <label style={{ color: C.muted, fontSize: '10px' }}>Hobbyname (öffentlich sichtbar statt echtem Namen)</label>
                  <input
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    placeholder="z. B. CardCollector92"
                    className="w-full px-3 py-2 rounded-lg text-sm mt-1"
                    style={{ background: C.surfaceLight, color: C.ink, border: `1px solid ${C.border}` }}
                  />
                </div>
                <div className="col-span-2">
                  <label className="flex items-center gap-1.5" style={{ color: C.muted, fontSize: '10px' }}>
                    <MapPin size={11} /> Stadt
                  </label>
                  <input
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    placeholder="z. B. Schweinfurt"
                    className="w-full px-3 py-2 rounded-lg text-sm mt-1"
                    style={{ background: C.surfaceLight, color: C.ink, border: `1px solid ${C.border}` }}
                  />
                  <div style={{ color: C.muted, fontSize: '10px', marginTop: '4px' }}>
                    Damit findest du Sammler in deiner Nähe — schau mal unter "Entdecken", ob schon jemand aus deiner Stadt dabei ist.
                  </div>
                </div>
                <div className="col-span-2">
                  <label style={{ color: C.muted, fontSize: '10px' }}>Lieblingsverein</label>
                  <select
                    value={profile.favoriteClub}
                    onChange={(e) => setProfile({ ...profile, favoriteClub: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-sm mt-1"
                    style={{ background: C.surfaceLight, color: C.ink, border: `1px solid ${C.border}` }}
                  >
                    {Object.keys(CLUBS).map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label style={{ color: C.muted, fontSize: '10px' }}>Kurze Bio (optional)</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="Sammle seit 2019 vor allem Bundesliga-Rookies..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg text-sm mt-1"
                    style={{ background: C.surfaceLight, color: C.ink, border: `1px solid ${C.border}` }}
                  />
                </div>
              </div>
            </div>

            <div>
              <div style={{ color: C.ink, fontFamily: 'Bungee, sans-serif', fontSize: '13px', marginBottom: '10px' }}>SICHTBARKEIT</div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs" style={{ background: C.surfaceLight, border: `1px solid ${C.border}`, color: C.ink }}>
                  <input type="checkbox" checked={profile.isPublic} onChange={(e) => setProfile({ ...profile, isPublic: e.target.checked })} />
                  Profil öffentlich (unter "Entdecken" für andere Sammler sichtbar)
                  {!profile.isPublic && (
                    <span className="flex items-center gap-1 ml-auto" style={{ color: C.muted }}><Lock size={11} /> nur du siehst dein Profil</span>
                  )}
                </label>
                <label
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
                  style={{ background: C.surfaceLight, border: `1px solid ${C.border}`, color: profile.isPublic ? C.ink : C.muted, opacity: profile.isPublic ? 1 : 0.5 }}
                >
                  <input
                    type="checkbox"
                    checked={profile.showRealName}
                    disabled={!profile.isPublic}
                    onChange={(e) => setProfile({ ...profile, showRealName: e.target.checked })}
                  />
                  Echten Namen öffentlich zeigen
                  {!profile.showRealName && (
                    <span className="flex items-center gap-1 ml-auto" style={{ color: C.muted }}><Lock size={11} /> standardmäßig aus — andere sehen nur "@{profile.username || 'nutzername'}"</span>
                  )}
                </label>
              </div>
              <div style={{ color: C.muted, fontSize: '10px', marginTop: '8px' }}>
                Einzelne Karten kannst du unabhängig davon über "Öffentlich sichtbar" in der Kartenansicht ausblenden.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selectedEntry && (
        <div
          className="fixed inset-0 flex items-center justify-center p-3 sm:p-6 z-50"
          style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={() => setSelectedEntry(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="rounded-2xl p-5 w-full max-w-sm overflow-y-auto"
            style={{ background: C.surface, border: '1px solid #DFC98D', maxHeight: '90vh' }}
          >
            <div className="flex items-center justify-between mb-3">
              <span style={{ fontFamily: 'Bungee, sans-serif', color: C.ink, fontSize: '15px' }}>{selectedEntry.player}</span>
              <button onClick={() => setSelectedEntry(null)}><X size={16} color={C.muted} /></button>
            </div>
            <div className="w-32 mx-auto mb-4">
              <Card entry={selectedEntry} owned={ownedMap[selectedEntry.id]} onClick={() => {}} photo={photos[selectedEntry.id]?.front} />
            </div>
            <div className="flex flex-col gap-2 text-xs" style={{ color: C.ink }}>
              <div className="flex justify-between"><span style={{ color: C.muted }}>Verein</span><span>{selectedEntry.club}</span></div>
              <div className="flex justify-between"><span style={{ color: C.muted }}>Saison</span><span>{selectedEntry.season}</span></div>
              <div className="flex justify-between"><span style={{ color: C.muted }}>Set</span><span>{setById(selectedEntry.setId)?.name}</span></div>
              <div className="flex justify-between"><span style={{ color: C.muted }}>Hersteller</span><span>{setById(selectedEntry.setId)?.manufacturer}</span></div>
              <div className="flex justify-between"><span style={{ color: C.muted }}>Seltenheit</span><span>{selectedEntry.rarity}{selectedEntry.auto && !selectedEntry.rarity.includes('Autograph') ? ' · Autograph' : ''}{selectedEntry.rookie ? ' · Rookie Card' : ''}</span></div>
              <div className="flex justify-between"><span style={{ color: C.muted }}>Auflage</span><span>{formatSerial(selectedEntry)}</span></div>
              {ownedMap[selectedEntry.id] && selectedEntry.rarity !== 'Base' && selectedEntry.num == null && (
                <div className="flex items-center gap-2 mt-1">
                  <span style={{ color: C.muted, fontSize: '11px', flexShrink: 0 }}>Gezogene Seriennummer eintragen</span>
                  <input
                    type="number"
                    min="1"
                    max={selectedEntry.print || undefined}
                    placeholder="z. B. 21"
                    onChange={(e) => updateSerialNum(selectedEntry.id, e.target.value)}
                    className="px-2 py-1 rounded text-xs flex-1"
                    style={{ background: C.surfaceLight, border: `1px solid ${C.border}`, color: C.ink }}
                  />
                </div>
              )}
              {ownedMap[selectedEntry.id] && (
                <div className="flex justify-between"><span style={{ color: C.muted }}>Zustand</span><span>{ownedMap[selectedEntry.id].cond}</span></div>
              )}
              {ownedMap[selectedEntry.id] && (
                <div className="flex justify-between"><span style={{ color: C.muted }}>Ankaufspreis</span><span>€{ownedMap[selectedEntry.id].price ?? 0}</span></div>
              )}
            </div>

            {ownedMap[selectedEntry.id] && (
              <div className="mt-3 flex items-center gap-2">
                <span style={{ color: C.muted, fontSize: '11px', flexShrink: 0 }}>Gewünschter Verkaufspreis</span>
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg flex-1" style={{ background: C.surfaceLight, border: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: '12px', color: C.muted }}>€</span>
                  <input
                    type="number"
                    value={ownedMap[selectedEntry.id].sellPrice ?? ''}
                    onChange={(e) => updateSellPrice(selectedEntry.id, e.target.value)}
                    placeholder="—"
                    className="bg-transparent flex-1 text-xs"
                    style={{ color: C.ink }}
                  />
                </div>
              </div>
            )}

            {ownedMap[selectedEntry.id] && (
              <label className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs" style={{ background: C.surfaceLight, border: `1px solid ${C.border}`, color: C.ink }}>
                <input type="checkbox" checked={ownedMap[selectedEntry.id].isPublic !== false} onChange={() => togglePublic(selectedEntry.id)} />
                Öffentlich sichtbar
                {ownedMap[selectedEntry.id].isPublic === false && (
                  <span className="flex items-center gap-1 ml-auto" style={{ color: C.muted }}><Lock size={11} /> nur für dich</span>
                )}
              </label>
            )}

            {ownedMap[selectedEntry.id] && (
              <div className="mt-3">
                <div style={{ fontSize: '11px', color: C.muted, marginBottom: '6px' }}>Eigene Fotos (Echtheits- &amp; Zustandsnachweis)</div>
                <div className="grid grid-cols-2 gap-2">
                  {['front', 'back'].map((side) => {
                    const photo = photos[selectedEntry.id]?.[side];
                    const inputId = `photo-${side}-${selectedEntry.id}`;
                    return (
                      <div key={side} className="relative">
                        {photo ? (
                          <div className="relative rounded-lg overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
                            <img src={photo} alt={side === 'front' ? 'Vorderseite' : 'Rückseite'} className="w-full object-cover" style={{ aspectRatio: '5/7' }} />
                            <button
                              onClick={() => removePhoto(selectedEntry.id, side)}
                              className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
                              style={{ background: 'rgba(28,26,21,0.7)', color: '#FFFCF2' }}
                            >
                              <X size={11} />
                            </button>
                          </div>
                        ) : (
                          <label
                            htmlFor={inputId}
                            className="flex flex-col items-center justify-center gap-1 rounded-lg cursor-pointer"
                            style={{ border: `1.5px dashed ${C.border}`, aspectRatio: '5/7', color: C.muted }}
                          >
                            <Camera size={16} />
                            <span style={{ fontSize: '10px' }}>{side === 'front' ? 'Vorderseite' : 'Rückseite'}</span>
                            <input
                              id={inputId}
                              type="file"
                              accept="image/*"
                              capture="environment"
                              className="hidden"
                              onChange={(e) => handlePhotoCapture(selectedEntry.id, side, e.target.files?.[0])}
                            />
                          </label>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: C.surfaceLight }}>
              <Sparkles size={13} color={C.gold} />
              <span style={{ fontSize: '11px', color: C.muted }}>KI-Schätzwert folgt in Phase 2 — aktuell manueller Preis</span>
            </div>

            {ownedMap[selectedEntry.id] && (
              <button
                onClick={() => removeFromCollection(selectedEntry.id)}
                className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold"
                style={{ background: 'transparent', border: `1px solid ${C.danger}`, color: C.danger }}
              >
                <Trash2 size={13} /> Aus Sammlung entfernen
              </button>
            )}
            {!ownedMap[selectedEntry.id] && view === 'entdecken' && (
              <div className="mt-4 flex items-center gap-1.5 text-xs" style={{ color: C.muted }}>
                <ShieldCheck size={13} /> Teil der Sammlung eines anderen Nutzers
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
