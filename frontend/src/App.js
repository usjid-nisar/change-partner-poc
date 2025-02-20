import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { DataTable } from './components/DataTable';
import './App.css';

function App() {
  const [processedData, setProcessedData] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Create mapping of variables to their high level categories
  const categoryMapping = {
    // Summary Variables
    wc: "Word count",
    analytic: "Analytical thinking",
    clout: "Clout",
    authentic: "Authentic",
    tone: "Emotional tone",
    wps: "Words per sentence",
    bigwords: "Big words",
    dic: "Dictionary words",
    
    // Linguistic Dimensions
    function: "Total function words",
    pronoun: "Total pronouns",
    ppron: "Personal pronouns",
    i: "1st person singular",
    we: "1st person plural",
    you: "2nd person",
    shehe: "3rd person singular",
    they: "3rd person plural",
    ipron: "Impersonal pronouns",
    det: "Determiners",
    article: "Articles",
    number: "Numbers",
    prep: "Prepositions",
    auxverb: "Auxiliary verbs",
    adverb: "Adverbs",
    conj: "Conjunctions",
    negate: "Negations",
    verb: "Common verbs",
    adj: "Common adjectives",
    quantity: "Quantities",

    // Drives
    Drives: "Drives",
    affiliation: "Affiliation",
    achieve: "Achievement",
    power: "Power",

    // Cognition
    allnone: "All-or-none",
    cogproc: "Cognitive processes",
    insight: "Insight",
    cause: "Causation",
    discrep: "Discrepancy",
    tentat: "Tentative",
    certitude: "Certitude",
    differ: "Differentiation",
    memory: "Memory",

    // Affect
    tone_pos: "Positive tone",
    tone_neg: "Negative tone",
    emotion: "Emotion",
    emo_pos: "Positive emotion",
    emo_neg: "Negative emotion",
    emo_anx: "Anxiety",
    emo_anger: "Anger",
    emo_sad: "Sadness",
    swear: "Swear words",

    // Social processes
    socbehav: "Social behavior",
    prosocial: "Prosocial behavior",
    polite: "Politeness",
    conflict: "Interpersonal conflict",
    moral: "Moralization",
    comm: "Communication",
    socrefs: "Social referents",
    family: "Family",
    friend: "Friends",
    female: "Female references",
    male: "Male references",

    // Culture
    politic: "Politics",
    ethnicity: "Ethnicity",
    tech: "Technology",
    lifestyle: "Lifestyle",
    leisure: "Leisure",
    home: "Home",
    work: "Work",
    money: "Money",
    relig: "Religion",

    // Physical
    health: "Health",
    illness: "Illness",
    wellness: "Wellness",
    mental: "Mental health",
    substances: "Substances",
    sexual: "Sexual",
    food: "Food",
    death: "Death",

    // States
    need: "Need",
    want: "Want",
    acquire: "Acquire",
    lack: "Lack",
    fulfill: "Fulfilled",
    fatigue: "Fatigue",

    // Motives
    reward: "Reward",
    risk: "Risk",
    curiosity: "Curiosity",
    allure: "Allure",

    // Perception
    attention: "Attention",
    motion: "Motion",
    space: "Space",
    visual: "Visual",
    auditory: "Auditory",
    feeling: "Feeling",

    // Time orientation
    time: "Time",
    focuspast: "Past focus",
    focuspresent: "Present focus",
    focusfuture: "Future focus",

    // Conversational
    Conversation: "Conversation",
    netspeak: "Netspeak",
    assent: "Assent",
    nonflu: "Nonfluencies",
    filler: "Fillers"
  };

  const handleUploadSuccess = (data) => {
    // Create case-insensitive lookup function
    const getCategoryInsensitive = (dimension) => {
      const dimensionKey = Object.keys(categoryMapping).find(
        key => key.toLowerCase() === dimension.toLowerCase()
      );
      return categoryMapping[dimensionKey] || "Unknown";
    };

    // Process the data to add high level categories
    const processedWithCategories = data.data.map(item => ({
      ...item,
      highLevelCategory: getCategoryInsensitive(item.Dimensions)
    }));

    // Update both processed and raw data with categories
    const rawWithCategories = data.rawData.map(item => ({
      ...item,
      highLevelCategory: getCategoryInsensitive(item.Dimensions)
    }));

    setProcessedData(processedWithCategories);
    setRawData(rawWithCategories);
    setError('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Data Analysis Tool</h1>
      </header>
      <main className="App-main">
        <FileUpload 
          onUploadSuccess={handleUploadSuccess}
          onError={setError}
          setLoading={setLoading}
        />
        
        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loading">Processing...</div>}
        
        {(processedData || rawData) && (
          <DataTable 
            processedData={processedData}
            rawData={rawData}
          />
        )}
      </main>
    </div>
  );
}

export default App;
