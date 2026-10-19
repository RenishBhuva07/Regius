// G2P phonetic translator for Kokoro TTS (IPA mapping)

// Common English dictionary with phonetic IPA mappings for Kokoro-82M
const PHONEME_DICTIONARY: Record<string, string> = {
  regius: 'ɹˈiʤiəs',
  regis: 'ɹˈiʤɪs',
  hey: 'hˈeɪ',
  hello: 'həlˈoʊ',
  hi: 'hˈaɪ',
  there: 'ðˈɛɹ',
  im: 'ˈaɪm',
  i: 'ˈaɪ',
  am: 'ɐm',
  listening: 'lˈɪsənɪŋ',
  what: 'wˈʌt',
  can: 'kˈæn',
  help: 'hˈɛlp',
  you: 'ju',
  with: 'wˈɪð',
  here: 'hˈɪɹ',
  would: 'wˈʊd',
  like: 'lˈaɪk',
  me: 'mi',
  to: 'tə',
  do: 'du',
  ready: 'ɹˈɛdi',
  when: 'wˈɛn',
  are: 'ɑɹ',
  yes: 'jˈɛs',
  tell: 'tˈɛl',
  whats: 'wˈʌts',
  on: 'ˈɑn',
  your: 'jˈɔɹ',
  mind: 'mˈaɪnd',
  go: 'ɡˈoʊ',
  ahead: 'əhˈɛd',
  how: 'hˈaʊ',
  assist: 'əsˈɪst',
  all: 'ˈɔl',
  ears: 'ˈɪɹz',
  today: 'tədˈeɪ',
  good: 'ɡˈʊd',
  morning: 'mˈɔɹnɪŋ',
  afternoon: 'ˌæftɚnˈun',
  evening: 'ˈivnɪŋ',
  task: 'tˈæsk',
  tasks: 'tˈæsks',
  reminder: 'ɹimˈaɪndɚ',
  reminders: 'ɹimˈaɪndɚz',
  scheduled: 'skˈɛʤuld',
  habit: 'hˈæbət',
  habits: 'hˈæbəts',
  focus: 'fˈoʊkəs',
  sprint: 'spɹˈɪnt',
  review: 'ɹivjˈu',
  meditation: 'ˌmɛdətˈeɪʃən',
  mindfulness: 'mˈaɪndfəlnəs',
  time: 'tˈaɪm',
  minutes: 'mˈɪnəts',
  done: 'dˈʌn',
  completed: 'kəmplˈitəd',
  created: 'kɹiˈeɪtəd',
  added: 'ˈædəd',
  at: 'ˈæt',
  for: 'fˈɔɹ',
  and: 'ænd',
  the: 'ðə',
  a: 'ə',
  an: 'æn',
  of: 'ˈʌv',
  in: 'ˈɪn',
  is: 'ˈɪz',
  it: 'ˈɪt',
  its: 'ˈɪts',
  not: 'nˈɑt',
  have: 'hˈæv',
  has: 'hˈæz',
  had: 'hˈæd',
  will: 'wˈɪl',
  be: 'bˈi',
  this: 'ðˈɪs',
  that: 'ðˈæt',
  from: 'fɹˈʌm',
  by: 'bˈaɪ',
  or: 'ˈɔɹ',
  but: 'bˈʌt',
  we: 'wi',
  they: 'ðˈeɪ',
  them: 'ðˈɛm',
  their: 'ðˈɛɹ',
  my: 'mˈaɪ',
  our: 'ˈaʊɚ',
};

// Common word suffix phonetic replacements
const SUFFIX_RULES: [RegExp, string][] = [
  [/tion$/i, 'ʃən'],
  [/tions$/i, 'ʃənz'],
  [/sion$/i, 'ʒən'],
  [/ing$/i, 'ɪŋ'],
  [/ment$/i, 'mənt'],
  [/able$/i, 'əbəl'],
  [/ible$/i, 'əbəl'],
  [/ness$/i, 'nəs'],
  [/ful$/i, 'fəl'],
  [/less$/i, 'ləs'],
  [/ly$/i, 'li'],
  [/ed$/i, 'd'],
  [/er$/i, 'ɚ'],
  [/est$/i, 'əst'],
];

// Fallback letter-to-IPA phoneme mapping
const CHAR_TO_IPA: Record<string, string> = {
  a: 'æ',
  b: 'b',
  c: 'k',
  d: 'd',
  e: 'ɛ',
  f: 'f',
  g: 'ɡ',
  h: 'h',
  i: 'ɪ',
  j: 'ʤ',
  k: 'k',
  l: 'l',
  m: 'm',
  n: 'n',
  o: 'ɑ',
  p: 'p',
  q: 'k',
  r: 'ɹ',
  s: 's',
  t: 't',
  u: 'ʌ',
  v: 'v',
  w: 'w',
  x: 'ks',
  y: 'j',
  z: 'z',
};

// Convert single word to IPA phonemes
export function phonemizeWord(word: string): string {
  const lower = word.toLowerCase().trim();
  if (!lower) return '';

  // Direct dictionary lookup
  if (PHONEME_DICTIONARY[lower]) {
    return PHONEME_DICTIONARY[lower];
  }

  // Check suffix heuristics
  for (const [pattern, ipa] of SUFFIX_RULES) {
    if (pattern.test(lower)) {
      const stem = lower.replace(pattern, '');
      const stemIpa =
        PHONEME_DICTIONARY[stem] ||
        stem
          .split('')
          .map(c => CHAR_TO_IPA[c] || c)
          .join('');
      return `${stemIpa}${ipa}`;
    }
  }

  // Character-by-character IPA fallback
  let result = '';
  for (let i = 0; i < lower.length; i++) {
    const ch = lower[i];
    // Digraph rules
    if (ch === 't' && lower[i + 1] === 'h') {
      result += 'ð';
      i++;
    } else if (ch === 's' && lower[i + 1] === 'h') {
      result += 'ʃ';
      i++;
    } else if (ch === 'c' && lower[i + 1] === 'h') {
      result += 'ʧ';
      i++;
    } else if (ch === 'e' && lower[i + 1] === 'e') {
      result += 'i';
      i++;
    } else if (ch === 'o' && lower[i + 1] === 'o') {
      result += 'u';
      i++;
    } else {
      result += CHAR_TO_IPA[ch] || ch;
    }
  }

  return result;
}

// Convert text to IPA phonemes preserving punctuation
export function phonemize(text: string): string {
  if (!text) return '';

  const tokens = text.match(/([a-zA-Z]+|[0-9]+|[^\s\w]+|\s+)/g) || [text];
  let phonemized = '';

  for (const token of tokens) {
    if (/^[a-zA-Z]+$/.test(token)) {
      phonemized += phonemizeWord(token);
    } else {
      // Keep punctuation and spaces intact for Kokoro's phrasing
      phonemized += token;
    }
  }

  return phonemized;
}
