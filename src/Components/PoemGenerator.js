import data from "../Data/SentenceParts.json";
import React, { useState,useEffect } from 'react';

function PoemGenerator() {

  useEffect(() => {
    const pageName = "Poem Generator"; 
    document.title = pageName;  
    document.getElementById("header").innerHTML = pageName
  }, []);

 

  const [usedValues, setUsedValues] = useState({});

  let lastRand = 0;

  const getRand = () => {
    let r = Math.random();
    while (r === lastRand) {
      r = Math.random();
    }
    lastRand = r;
    return r;
  }

  const getRandFromArrayInner = (array) => array[Math.floor((getRand() * array.length - 1) + 1)];

  const tryGetUnusedValue = (array, name) => {

    let value = getRandFromArrayInner(array);

    if (usedValues.hasOwnProperty(name) && usedValues[name].length < array.length) {

      while (usedValues[name].includes(value)) {
        value = getRandFromArrayInner(array);
      }
    }

    return value;
  }

  const setUnusedValues = (name, value) => {
    const clone = usedValues;
    if (!clone.hasOwnProperty(name)) {
      clone[name] = [];
    }
    clone[name].push(value);
    setUsedValues(clone);
  }

  const getRandFromArray = (array, name) => {
    let value = tryGetUnusedValue(array, name);
    setUnusedValues(name, value);
    return value;
  }


  const randomRange = (min, max) => Math.floor(Math.random() * (max - min) + min);


  const simple = () => `The ${getRandFromArray(data.adjective, "adjective")} ${getRandFromArray(data.concrete_noun, "concrete_noun")} ${getRandFromArray(data.verb, "verb")} ${getRandFromArray(data.preposition, "preposition")} ${getRandFromArray(data.article, "article")} ${getRandFromArray(data.adjective, "adjective")} ${getRandFromArray(data.common_noun, "common_noun")}`

  const simple1 = () => `${getRandFromArray(data.article, "article")} ${getRandFromArray(data.concrete_noun, "concrete_noun")} ${getRandFromArray(data.verb, "verb")}`

  const simple2 = () => `${getRandFromArray(data.proper_noun, "common_noun")} ${getRandFromArray(data.verb, "verb")} ${getRandFromArray(data.preposition, "preposition")} ${getRandFromArray(data.article, "article")} ${getRandFromArray(data.adjective, "adjective")} ${getRandFromArray(data.common_noun, "common_noun")}`

  const simple3 = () => `${getRandFromArray(data.article, "article")} ${getRandFromArray(data.common_noun, "common_noun")} ${getRandFromArray(data.verb, "verb")} ${getRandFromArray(data.preposition, "preposition")} ${getRandFromArray(data.article, "article")} ${getRandFromArray(data.concrete_noun, "concrete_nou")}`

  const simple4 = () => simple() + ", " + simple3()

  const simple5 = () => {
    const noun = getRandFromArray(data.concrete_noun,"concrete_noun");
    const f = "aeiou".includes(noun[0]) ? "An": "A";
    return `${f} ${noun} ${getRandFromArray(data.verb,"verb")}`
    
  }


  const toSentenceCase = (s) => s
    .split(' ')
    .map((word, i) => i === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word).join(" ");


  const createPoem = () => {
    const numLines = randomRange(4, 10);
    let d = {};
    d.numberOfLines = numLines;
    d.lines = [];
    for (let i = 0; i < numLines + 1; i++) {
      const numType = randomRange(0, 6);
      const lineInfo = {};
      if (numType === 0) { lineInfo.text = toSentenceCase(simple() + "."); }
      else if (numType === 1) { lineInfo.text = toSentenceCase(simple1() + "."); }
      else if (numType === 2) { lineInfo.text = toSentenceCase(simple2() + "."); }
      else if (numType === 3) { lineInfo.text = toSentenceCase(simple3() + "."); }
      else if (numType === 4) { lineInfo.text = simple4() + "." }
      else if (numType === 5) { lineInfo.text = simple5() + "." }
      lineInfo.type = numType + 1;
      d.lines.push(lineInfo);
    }
    return d;
  }


  const nextPoem = () => {

    let c = usedValues;

    for (var k in c) {
      delete c[k];
    }

    setUsedValues(c);
    console.log(usedValues);
    setPoem(createPoem());
  }


  const displayPoem = (a) => a.map((s, index) => <div key={index}>{s.text}</div>)

  const displayPoemInfo = (a) => a.map((s, index) => <li key={index}><i>Type : {s.type}</i> -- {s.text} </li>)

  const displayUsedValuesInfo = (a) => Object.keys(a).map((s) => <li key={s}><i>{s}</i>: {a[s].join(", ")} </li>)

  // console.log(poem.usedValues);

  const [poem, setPoem] = useState({
    numberOfLines: 0,
    lines: []
  });


  return (
      <div>
        <button className="button" onClick={() => nextPoem()}>
          Create New
        </button>
        <blockquote>
          {displayPoem(poem.lines)}
        </blockquote>
       <details>
        <summary>Debug Trace Info</summary>
          Created {poem.numberOfLines} line poem.
          <h5>Types Generated</h5>
          <ul>{displayPoemInfo(poem.lines)}</ul>
          <h5>Data set - used Values</h5>
          <ul>{displayUsedValuesInfo(usedValues)}</ul>
          <h5>Data set - all avaliable values</h5>
          <ul>{displayUsedValuesInfo(data)}</ul>
          <h5>Type definitions</h5>
          <ul>
            <li>1 = 'The' adjective concrete_noun verb preposition article adjective common_noun.</li>
            <li>2 = article concrete_noun verb.</li>
            <li>3 = common_noun verb preposition article adjective common_noun.</li>
            <li>4 = article common_noun verb preposition article concrete_nou.</li>
            <li>5 = Type 1 , Type 3 </li>
            <li>6 = An|A concrete_noun verb </li>
          </ul>
      </details>
      </div>
  );
}

export default PoemGenerator;