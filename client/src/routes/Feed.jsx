import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const Feed = () => {
  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
  } = useForm({
    mode: 'onChange',
    defaultValues: { firstName: '', email: '', feedback: '' },
  });

  const firstName = watch('firstName');
  const email     = watch('email');
  const feedback  = watch('feedback');

  const [currentStep, setCurrentStep]   = useState('firstName');
  const [showEmail,     setShowEmail]   = useState(false);
  const [showFeedback,  setShowFeedback]= useState(false);
  const [isComplete,    setIsComplete]  = useState(false);

  const handleKeyDown = useCallback((e) => {
    if (e.ctrlKey || e.altKey || e.metaKey) return;

    if (e.key === 'Enter') {
      if (currentStep === 'feedback' && e.shiftKey) {
        setValue('feedback', feedback + '\n');
        return;
      }

      if (currentStep === 'firstName' && firstName.trim()) {
        setShowEmail(true);
        setCurrentStep('email');
      } else if (currentStep === 'email' && email.trim()) {
        setShowFeedback(true);
        setCurrentStep('feedback');
      } else if (currentStep === 'feedback' && feedback.trim() && !e.shiftKey) {
        setCurrentStep('complete');
        setIsComplete(true);
  handleSubmit(onSubmit)();
      }
      return;
    }


    if (e.key === 'Backspace') {
      if (currentStep === 'firstName')   setValue('firstName',  firstName.slice(0, -1));
      else if (currentStep === 'email')  setValue('email',      email.slice(0, -1));
      else if (currentStep === 'feedback') setValue('feedback', feedback.slice(0, -1));
      return;
    }

 
    if (e.key === 'Escape') { handleReset(); return; }

    
    if (e.key.length === 1) {
      if (currentStep === 'firstName')   setValue('firstName',  firstName + e.key);
      else if (currentStep === 'email')  setValue('email',      email + e.key);
      else if (currentStep === 'feedback') setValue('feedback', feedback + e.key);
    }
  }, [currentStep, firstName, email, feedback, setValue, handleSubmit]);
  const handleReset = () => {
    reset();
    setCurrentStep('firstName');
    setShowEmail(false);
    setShowFeedback(false);
    setIsComplete(false);
  };

  const onSubmit = async (data) => {
    const r = await fetch("http://localhost:3000/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: data })
            });
            const res = await r.json();

            if (res.message === "True") {
      console.log('Feedback submitted:', data);
      handleReset();
      return true;
    } else {
      console.error('Error submitting feedback:', res.message);
      return false;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);



  const renderLines = (txt) =>
    txt.split('\n').map((l,i)=>(
      <React.Fragment key={i}>
        {l}
        {i < txt.split('\n').length - 1 && <br/>}
      </React.Fragment>
    ));


  return (
    <>
      <div className="w-full h-screen bg-black flex items-center justify-center pt-20">
        <div className="relative w-full h-full overflow-hidden" style={{aspectRatio:'16/9'}}>


          <div className="absolute inset-0">
            <div className='absolute inset-0 bg-[url("https://upload.wikimedia.org/wikipedia/commons/e/e4/StarfieldSimulation.gif")] bg-no-repeat bg-center bg-cover blur-[2px] scale-[1.1]'/>
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/40 to-black/60"/>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/5"/>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white space-y-6 max-w-4xl px-8">
              <div className="space-y-4">
                <h1 className="feedback-3d-text text-7xl font-bold tracking-widest">
                  FEEDBACK
                </h1>
                <div className="w-40 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent mx-auto opacity-60"/>
              </div>
              <p className="text-2xl font-light leading-relaxed">
                Your thoughts shape our future
              </p>
              <div className="space-y-3">
                <div className="text-white text-lg">
                  Start typing in the top right corner
                </div>
                <div className="flex justify-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"/>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"
                       style={{animationDelay:'0.1s'}}/>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"
                       style={{animationDelay:'0.2s'}}/>
                </div>
              </div>
            </div>
          </div>


          <div className="absolute bottom-8 left-8 space-y-3 z-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all">
              <div className="text-white/60 text-sm">Feedback Today</div>
              <div className="text-white text-2xl font-light">247</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all">
              <div className="text-white/60 text-sm">Satisfaction</div>
              <div className="text-white text-2xl font-light">4.8★</div>
            </div>
          </div>


          <div className="absolute top-8 left-8 max-w-md z-10">
            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:bg-black/30 transition-all">
              <div className="text-white/80 italic text-lg leading-relaxed">
                "Every piece of feedback is a stepping stone to excellence."
              </div>
              <div className="text-white/50 text-sm mt-3">— Innovation Team</div>
            </div>
          </div>


          <div className="absolute top-20 right-1/4 w-24 h-24 border border-white/10 rotate-45 animate-spin opacity-20 pointer-events-none"
               style={{animationDuration:'20s'}}/>
          <div className="absolute bottom-32 left-1/3 w-20 h-20 border border-white/10 rounded-full animate-pulse opacity-20 pointer-events-none"/>


          <div className="absolute top-8 right-8 w-80 p-6 bg-black/30 backdrop-blur-md rounded-xl border border-white/20 z-20 shadow-2xl">
            <h2 className="text-white/90 font-mono text-xl mb-4 text-center">
              Feedback Form
            </h2>


            <div className="mb-4 flex space-x-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded transition-all duration-300 ${
                    i <
                    (currentStep === 'firstName' ? 1 :
                     currentStep === 'email'     ? 2 :
                     currentStep === 'feedback'  ? 3 : 4)
                      ? 'bg-white shadow-sm shadow-white/50'
                      : i ===
                        (currentStep === 'firstName' ? 0 :
                         currentStep === 'email'     ? 1 :
                         currentStep === 'feedback'  ? 2 : 3)
                        ? 'bg-gray-300 shadow-sm shadow-gray-300/50'
                        : 'bg-white/20'
                  }`}
                />
              ))}
            </div>


            <style>
              {`@keyframes blink{0%{opacity:0}50%{opacity:1}100%{opacity:0}}
                .animate-blink{
                  animation:blink 1s cubic-bezier(1,0,0,1) infinite;
                  width:0.25rem;height:1.25rem;background:#ffffff;
                  display:inline-block;vertical-align:middle;margin-left:0.25rem;
                }`}
            </style>

            {!isComplete ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" autoComplete="off">

                <input type="text"     {...register('firstName')} className="hidden"/>
                <input type="email"    {...register('email')}     className="hidden"/>
                <textarea              {...register('feedback')}  className="hidden"/>

                <div className="flex items-start">
                  <span className="text-white text-base pt-1 flex-shrink-0">Name:</span>
                  <div className="text-white ml-2 flex-1 text-base min-h-[24px] break-words leading-relaxed">
                    {renderLines(firstName)}
                    {currentStep === 'firstName' && <span className="animate-blink"/>}
                  </div>
                </div>


                {showEmail && (
                  <div className="flex items-start">
                    <span className="text-white text-base pt-1 flex-shrink-0">Email:</span>
                    <div className="text-white ml-2 flex-1 text-base min-h-[24px] break-words leading-relaxed">
                      {renderLines(email)}
                      {currentStep === 'email' && <span className="animate-blink"/>}
                    </div>
                  </div>
                )}


                {showFeedback && (
                  <div className="flex items-start">
                    <span className="text-white min-w-[80px] pt-1 text-base flex-shrink-0">Feedback:</span>
                    <div className="text-white ml-2 flex-1 text-base min-h-[24px] break-words leading-relaxed">
                      {renderLines(feedback)}
                      {currentStep === 'feedback' && <span className="animate-blink"/>}
                    </div>
                  </div>
                )}


                <div className="text-white/50 text-xs mt-4 space-y-1">
                  <div>
                    Press <kbd className="px-1 py-0.5 bg-white/20 rounded text-white/70 text-xs">Enter</kbd> to continue
                  </div>
                  {currentStep === 'feedback' && (
                    <div>
                      Press <kbd className="px-1 py-0.5 bg-white/20 rounded text-white/70 text-xs">Shift+Enter</kbd> for new line
                    </div>
                  )}
                  <div>
                    Press <kbd className="px-1 py-0.5 bg-white/20 rounded text-white/70 text-xs">Esc</kbd> to reset
                  </div>
                </div>


                <button type="submit" style={{display:'none'}}/>
              </form>
            ) : (
              
              <div className="text-center space-y-4">
                <div className="text-white text-2xl">✓</div>
                <div className="text-white/90 text-base">Thank you for your feedback!</div>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-md transition-all duration-200 text-sm">
                  Submit Another
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Feed;
