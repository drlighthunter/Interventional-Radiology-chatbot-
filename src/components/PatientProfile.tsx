import React from 'react';
import { User, ClipboardList, MapPin, X } from 'lucide-react';
import { PatientDemographics } from '../types';

interface PatientProfileProps {
  demographics: PatientDemographics;
  onChange: (demographics: PatientDemographics) => void;
  onClose: () => void;
}

export const PatientProfile: React.FC<PatientProfileProps> = ({ demographics, onChange, onClose }) => {
  return (
    <div className="bg-white border-b border-slate-200 p-4 animate-in slide-in-from-top duration-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <User size={16} className="text-sky-500" />
          Patient Profile
        </h2>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <X size={16} />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Age & Gender</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Age"
              value={demographics.age || ''}
              onChange={(e) => onChange({ ...demographics, age: e.target.value })}
              className="w-1/3 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
            />
            <select
              value={demographics.gender || ''}
              onChange={(e) => onChange({ ...demographics, gender: e.target.value })}
              className="w-2/3 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
            >
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Location</label>
          <div className="relative">
            <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="City, State"
              value={demographics.location || ''}
              onChange={(e) => onChange({ ...demographics, location: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Planned Procedure</label>
          <select
            value={demographics.procedure || ''}
            onChange={(e) => onChange({ ...demographics, procedure: e.target.value })}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
          >
            <option value="">Select Procedure</option>
            <option value="Uterine Artery Embolization (UAE)">Uterine Artery Embolization (UAE)</option>
            <option value="Prostate Artery Embolization (PAE)">Prostate Artery Embolization (PAE)</option>
            <option value="Peripheral Arterial Disease (PAD) Treatment">PAD Treatment</option>
            <option value="Varicose Vein Ablation">Varicose Vein Ablation</option>
            <option value="Liver Tumor Embolization (TACE/Y90)">Liver Tumor Embolization</option>
            <option value="Biopsy / Drainage">Biopsy / Drainage</option>
            <option value="Kyphoplasty / Vertebroplasty">Kyphoplasty</option>
            <option value="Other / Not Sure">Other / Not Sure</option>
          </select>
        </div>

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Current Medications</label>
            <textarea
              placeholder="Blood thinners, Aspirin, etc."
              value={demographics.medications || ''}
              onChange={(e) => onChange({ ...demographics, medications: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none min-h-[60px]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Allergies</label>
            <textarea
              placeholder="Contrast dye, Latex, Iodine, etc."
              value={demographics.allergies || ''}
              onChange={(e) => onChange({ ...demographics, allergies: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none min-h-[60px]"
            />
          </div>
        </div>

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Current Symptoms</label>
            <textarea
              placeholder="Leg pain, swelling, etc."
              value={demographics.symptoms || ''}
              onChange={(e) => onChange({ ...demographics, symptoms: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none min-h-[60px]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Confirmed Diagnosis</label>
            <textarea
              placeholder="PAD, Uterine Fibroids, etc."
              value={demographics.diagnosis || ''}
              onChange={(e) => onChange({ ...demographics, diagnosis: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none min-h-[60px]"
            />
          </div>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Medical History</label>
          <div className="relative">
            <ClipboardList size={14} className="absolute left-3 top-3 text-slate-400" />
            <textarea
              placeholder="Diabetes, Hypertension, Previous surgeries..."
              value={demographics.history || ''}
              onChange={(e) => onChange({ ...demographics, history: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none min-h-[80px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
