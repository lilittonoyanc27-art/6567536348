import React, { useState } from 'react';
import { BookOpen, X, Volume2, Sparkles, Check } from 'lucide-react';

interface VocabularyReferenceProps {
  isOpen: boolean;
  onClose: () => void;
}

interface VocabTerm {
  spanish: string;
  armenian: string;
  literalMeaning?: string;
  usageContext: string;
}

const KEY_VOCABULARY: VocabTerm[] = [
  {
    spanish: 'Es un placer / Fue un placer',
    armenian: 'Շատ հաճելի է / Հաճույք էր',
    literalMeaning: 'Դա հաճույք է',
    usageContext: 'Դասական իսպանական ողջույն և քաղաքավարի պատասխան ծանոթանալիս:',
  },
  {
    spanish: 'Permítame presentarle...',
    armenian: 'Թույլ տվեք Ձեզ ներկայացնել...',
    literalMeaning: 'Թույլատրեք ինձ ներկայացնել Ձեզ',
    usageContext: 'Պաշտոնական և հարգալից (Usted) ձևակերպում երրորդ անձին ներկայացնելիս:',
  },
  {
    spanish: 'Un obsequio',
    armenian: 'Նվեր, ընծա',
    literalMeaning: 'Նվեր (ավելի նրբագեղ, քան սովորական «regalo»-ն)',
    usageContext: 'Դոն Ալեխանդրոն ասում է, որ չի բերել նվեր տանտիրուհու համար:',
  },
  {
    spanish: 'La anfitriona',
    armenian: 'Տանտիրուհի (հյուրընկալող կին)',
    literalMeaning: 'Հյուրընկալ տիրուհի',
    usageContext: 'Օգտագործվում է երեկույթի կամ ընդունելության գլխավոր տիրուհուն դիմելիս:',
  },
  {
    spanish: 'Recién llegado',
    armenian: 'Նոր ժամանած',
    literalMeaning: 'Հենց նոր եկած',
    usageContext: '«Recién llegado de España» — նոր է եկել Իսպանիայից:',
  },
  {
    spanish: 'Alma gemela',
    armenian: 'Հոգու ընկեր, հարազատ հոգի',
    literalMeaning: 'Երկվորյակ հոգի',
    usageContext: 'Դոն Ռաֆայելը կապիտանին ներկայացնում է որպես իր հոգու ընկեր:',
  },
  {
    spanish: 'Bandido legendario',
    armenian: 'Լեգենդար ավազակ',
    literalMeaning: 'Լեգենդ դարձած ավազակ (Զորրոն)',
    usageContext: 'Ալեխանդրոյի հեգնական հարցը կապիտան Հարիսոն Լոդին:',
  },
  {
    spanish: 'Pensarlo dos veces',
    armenian: 'Երկու անգամ մտածել / Լավ կշռադատել',
    literalMeaning: 'Երկու անգամ մտածել',
    usageContext: 'Իսպանական դարձվածք՝ «pero nosotros lo pensaremos dos veces»:',
  },
  {
    spanish: 'Ir a confesarnos',
    armenian: 'Խոստովանության գնալ',
    literalMeaning: 'Եկեղեցում խոստովանել մեղքերը',
    usageContext: 'Սրամիտ ակնարկ Զորրոյի՝ վանականի կերպարանքով փախուստի մասին:',
  },
];

export const VocabularyReference: React.FC<VocabularyReferenceProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'es-ES';
    utt.rate = 0.9;
    window.speechSynthesis.speak(utt);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#781C32] w-full max-w-3xl rounded-3xl border-2 border-[#F6C453] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 bg-[#5a1431] border-b border-[#F6C453]/25 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-[#F6C453]" />
            <h3 className="font-cinzel text-lg md:text-xl font-bold text-white">
              Vocabulario Clave · Բառարան և արտահայտություններ
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#4A1028] text-amber-200 hover:text-white hover:bg-[#E97928] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <p className="text-amber-100/90 text-xs md:text-sm">
            Այս տեսարանում օգտագործվում են դասական իսպանական արիստոկրատական բառեր և դարձվածքներ։
            Սեղմեք բարձրախոսի վրա՝ իսպաներեն ճիշտ արտասանությունը լսելու համար։
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {KEY_VOCABULARY.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#4A1028] rounded-2xl p-5 border border-[#F6C453]/20 hover:border-[#F6C453]/60 transition-all space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-white text-lg md:text-xl">
                    {item.spanish}
                  </span>
                  <button
                    onClick={() => speak(item.spanish)}
                    className="p-2 rounded-lg bg-[#781C32] text-amber-200 hover:text-white hover:bg-[#E97928] transition-colors"
                    title="Լսել արտասանությունը"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-base md:text-lg font-armenian font-semibold text-[#FEF08A]">
                  {item.armenian}
                </div>

                <p className="text-xs md:text-sm font-armenian text-amber-100/80 leading-relaxed pt-1.5 border-t border-[#F6C453]/15">
                  {item.usageContext}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#5a1431] border-t border-[#F6C453]/25 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#E97928] hover:bg-[#d66b1e] text-white text-xs font-semibold rounded-xl shadow transition-colors"
          >
            Փակել բառարանը
          </button>
        </div>
      </div>
    </div>
  );
};
