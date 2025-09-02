import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

const Ai = () => {
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasAsked, setHasAsked] = useState(false);
  const [questionText, setQuestionText] = useState('');
  
  const { register, handleSubmit: onSubmit, formState: { errors }, reset, setFocus } = useForm({
    defaultValues: {
      question: ''
    }
  });
  
  const answerContainerRef = useRef(null);
  const pulseRef = useRef(null);
  
  useEffect(() => {
    gsap.fromTo("#ai-background", 
      { x: -window.innerWidth }, 
      { x: 0, duration: 2, ease: 'power2.out' }
    );
    gsap.fromTo("#ai-title", 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 1 }
    );
    gsap.fromTo("#ai-form", 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: 'power2.out', delay: 1.5 }
    );
    setTimeout(() => {
      setFocus('question');
    }, 2000);
    gsap.fromTo(".ai-floating-element", 
      { y: 20, opacity: 0 }, 
      { y: 0, opacity: 0.1, duration: 2, ease: 'power2.out', delay: 2, stagger: 0.2 }
    );
    gsap.to(".ai-floating-element", {
      y: -20,
      duration: 4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: 3,
      stagger: 0.3
    });
  }, [setFocus]);
  
  useEffect(() => {
    if (isLoading) {
      gsap.to(pulseRef.current, {
        scale: 1.1,
        opacity: 0.7,
        duration: 0.8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });
    } else {
      gsap.killTweensOf(pulseRef.current);
      if (pulseRef.current) {
        gsap.set(pulseRef.current, { scale: 1, opacity: 1 });
      }
    }
  }, [isLoading]);

  useEffect(() => {
    if (answer && answerContainerRef.current) {
      gsap.fromTo(answerContainerRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
      );
    }
  }, [answer]);

  const handleSubmit = onSubmit(async (data) => {
    setIsLoading(true);
    setQuestionText(data.question);
    
    try {

        try {
          const r = await fetch('http://localhost:3000/ai', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question: data.question }),
            signal: AbortSignal.timeout(3000)
          });
          
          if (!r.ok) {
            throw new Error('Network response was not ok');
          }
          
          const answer = await r.json();
          setAnswer(answer.answer);
        } catch (fetchError) {
          console.error('Fetch error:', fetchError);
        }
        
        setHasAsked(true);
    } catch (err) {
      console.error('Error:', err);
      setAnswer("I'm sorry, I encountered an error. Please try again later.");
      setHasAsked(true);
    } finally {
      setIsLoading(false);
    }
  });

  const handleReset = () => {
    setAnswer('');
    setHasAsked(false);
    setQuestionText('');
    reset();
    
    setTimeout(() => {
      setFocus('question');
    }, 100);
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-white">
      <div id="ai-background" className="absolute inset-0 bg-white"></div>
      <div className="ai-floating-element absolute top-20 left-20 w-40 h-40 bg-black/5 rounded-full blur-2xl"></div>
      <div className="ai-floating-element absolute top-40 right-32 w-32 h-32 bg-black/5 rounded-full blur-2xl"></div>
      <div className="ai-floating-element absolute bottom-32 left-40 w-48 h-48 bg-black/5 rounded-full blur-2xl"></div>
      <div className="ai-floating-element absolute bottom-20 right-20 w-36 h-36 bg-black/5 rounded-full blur-2xl"></div>
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-16">
        <div className="w-full max-w-3xl mx-auto">
          <h1 id="ai-title" className="text-5xl md:text-6xl font-bold text-center text-black mb-8 opacity-0">
            Design<span className="text-gray-600">AI</span> Assistant
          </h1>
          <div id="ai-form" className="bg-white shadow-2xl rounded-2xl p-8 border border-gray-200 opacity-0">
            {!hasAsked ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="question" className="block text-gray-800 text-lg font-medium mb-2">
                    Ask me anything about design
                  </label>
                  <textarea
                    id="question"
                    {...register('question', {
                      required: 'Please enter a question'
                    })}
                    placeholder="What makes a design effective?"
                    rows="4"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-300"
                    disabled={isLoading}
                  ></textarea>
                </div>
                
                {errors.question && (
                  <div className="text-red-500 text-sm font-medium">{errors.question.message}</div>
                )}
                
                <div className="flex justify-center">
                  <button
                    type="submit"
                    ref={pulseRef}
                    disabled={isLoading}
                    className="px-8 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Thinking...' : 'Ask the AI'}
                  </button>
                </div>
              </form>
            ) : (
              <div ref={answerContainerRef} className="space-y-6">
                <div>
                  <h3 className="text-gray-600 text-lg font-medium mb-2">Your Question:</h3>
                  <p className="text-black italic">{questionText}</p>
                </div>
                
                <div>
                  <h3 className="text-gray-600 text-lg font-medium mb-2">AI Response:</h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-black">
                    {answer}
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <button
                    onClick={handleReset}
                    className="px-8 py-3 bg-gray-100 text-black font-medium rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300 border border-gray-300"
                  >
                    Ask Another Question
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ai;
