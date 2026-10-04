'use client';
import {useId} from 'react';
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from '../components/ui/select';
type Option={value:string;label:string;description?:string};
export default function StudySelect({label,value,onChange,options,disabled=false,className=''}:{label:string;value:string;onChange:(value:string)=>void;options:Option[];disabled?:boolean;className?:string}){
 const id=useId();
 return <div className={`study-select-field ${className}`}><label htmlFor={id}>{label}</label><Select value={value} onValueChange={onChange} disabled={disabled}><SelectTrigger id={id} className="study-select-trigger" aria-label={label}><SelectValue>{options.find(o=>o.value===value)?.label}</SelectValue></SelectTrigger><SelectContent className="study-select-menu" position="popper" align="start" sideOffset={5} collisionPadding={12}>{options.map(o=><SelectItem key={o.value} value={o.value} className="study-select-option"><span className="select-option-copy"><span>{o.label}</span>{o.description&&<small>{o.description}</small>}</span></SelectItem>)}</SelectContent></Select></div>;
}
