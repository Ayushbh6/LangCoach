import {execFileSync} from 'node:child_process';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {lessons} from '../data/lessons.ts';
const dir=mkdtempSync(join(tmpdir(),'german-audio-'));
try{for(const lesson of lessons){const text=lesson.exercises.find(e=>e.skill==='listening').transcript;const wav=join(dir,`${lesson.id}.aiff`);execFileSync('/usr/bin/say',['-v','Anna','-r','145','-o',wav,text]);execFileSync('ffmpeg',['-y','-i',wav,'-codec:a','libmp3lame','-b:a','80k',`public/audio/${lesson.id}.mp3`],{stdio:'ignore'});console.log(lesson.id);}}finally{rmSync(dir,{recursive:true,force:true});}
