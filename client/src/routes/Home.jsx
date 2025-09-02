import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Home = () => {
    const sectionRef = useRef(null);
    const timelineRef = useRef(null);

    useEffect(() => {
        // Main animations
        gsap.fromTo("#main-title", 
            { 
                y: 100, 
                opacity: 0,
                scale: 0.8
            }, 
            { 
                y: 0, 
                opacity: 1,
                scale: 1,
                duration: 1.5, 
                ease: 'power3.out',
                delay: 0.5
            }
        );

        gsap.fromTo("#subtitle", 
            { 
                y: 50, 
                opacity: 0
            }, 
            { 
                y: 0, 
                opacity: 1,
                duration: 1, 
                ease: 'power2.out',
                delay: 1.0
            }
        );

        gsap.fromTo("#cta-button", 
            { 
                scale: 0,
                opacity: 0
            }, 
            { 
                scale: 1,
                opacity: 1,
                duration: 0.8, 
                ease: 'back.out(1.7)',
                delay: 1.5
            }
        );

        // Floating elements
        gsap.fromTo(".floating-element", 
            { 
                y: 20,
                opacity: 0
            }, 
            { 
                y: 0,
                opacity: 0.1,
                duration: 2, 
                ease: 'power2.out',
                delay: 1.8,
                stagger: 0.2
            }
        );

        gsap.to(".floating-element", {
            y: -20,
            duration: 3,
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1,
            delay: 2.5,
            stagger: 0.3
        });

        // Feature cards animation
        gsap.fromTo(".feature-card", 
            {
                y: 50,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power2.out",
                stagger: 0.2,
                delay: 1.8
            }
        );

        // Icon animations
        gsap.fromTo(".icon-bounce", 
            {
                scale: 0.5,
                opacity: 0
            },
            {
                scale: 1,
                opacity: 1,
                duration: 0.5,
                ease: "back.out(1.7)",
                stagger: 0.1,
                delay: 2.0
            }
        );

        // Set up the scroll trigger for stats section
        timelineRef.current = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            }
        });

        timelineRef.current
            .fromTo(".stat-item", 
                {
                    y: 30,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.2,
                    duration: 0.6,
                    ease: "power1.out"
                }
            );

    }, []);

    return (
        <div className='relative min-h-screen overflow-hidden bg-gradient-to-b from-black via-gray-900 to-blue-950'>
            {/* Decorative elements */}
            <div className='floating-element absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl opacity-0'></div>
            <div className='floating-element absolute top-40 right-32 w-24 h-24 bg-purple-500/10 rounded-full blur-xl opacity-0'></div>
            <div className='floating-element absolute bottom-32 left-40 w-40 h-40 bg-yellow-500/10 rounded-full blur-xl opacity-0'></div>
            <div className='floating-element absolute bottom-20 right-20 w-28 h-28 bg-green-500/10 rounded-full blur-xl opacity-0'></div>
            <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3csvg width="60" height="60" xmlns="http://www.w3.org/2000/svg"%3e%3cdefs%3e%3cpattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse"%3e%3cpath d="m 60 0 l 0 60 l -60 0 l 0 -60 l 60 0 Z m -1 1 l -58 0 l 0 58 l 58 0 l 0 -58 Z" fill="none" stroke="%23ffffff" stroke-width="0.5" opacity="0.1"/%3e%3c/pattern%3e%3c/defs%3e%3crect width="100%25" height="100%25" fill="url(%23grid)"/%3e%3c/svg%3e")] opacity-20'></div>
            
            {/* Hero section */}
            <div className='relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-8 py-24'>
                <div className='max-w-5xl mx-auto'>
                    <h1 id='main-title' className='text-7xl md:text-8xl font-bold mb-6 text-white select-none leading-tight opacity-0 tracking-tight'>
                        Idea<span className='text-yellow-400'>Mandir</span>
                    </h1>
                    <p id='subtitle' className='text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed opacity-0'>
                        Empowering young minds to become entrepreneurs of tomorrow. Turn innovative ideas into impactful business ventures.
                    </p>
                    <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                        <Link to="/signup">
                            <button id='cta-button' className='px-8 py-4 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition-all duration-300 shadow-lg hover:shadow-yellow-500/20 transform hover:scale-105 hover:-translate-y-1 opacity-0 scale-0'>
                                Get Started
                            </button>
                        </Link>
                        <Link to="/ideas">
                            <button className='px-8 py-4 bg-transparent border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-white/5 transform hover:scale-105 hover:-translate-y-1'>
                                Explore Ideas
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features section */}
            <div className='relative z-10 py-20 px-8 bg-black/30 backdrop-blur-sm'>
                <div className='max-w-7xl mx-auto'>
                    <h2 className='text-4xl font-bold text-center text-white mb-16'>Why <span className='text-yellow-400'>IdeaMandir</span>?</h2>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                        <div className='feature-card bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:shadow-xl hover:-translate-y-2'>
                            <div className='h-14 w-14 rounded-xl bg-yellow-400/20 flex items-center justify-center mb-6'>
                                <svg className="icon-bounce h-8 w-8 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className='text-xl font-bold text-white mb-3'>Spark Creativity</h3>
                            <p className='text-gray-400'>Foster creative thinking and problem-solving skills as kids identify real-world challenges and craft innovative solutions.</p>
                        </div>
                        
                        <div className='feature-card bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:shadow-xl hover:-translate-y-2'>
                            <div className='h-14 w-14 rounded-xl bg-green-400/20 flex items-center justify-center mb-6'>
                                <svg className="icon-bounce h-8 w-8 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h3 className='text-xl font-bold text-white mb-3'>Build Business Skills</h3>
                            <p className='text-gray-400'>Learn essential entrepreneurship concepts like marketing, finance, and product development in a fun, engaging environment.</p>
                        </div>
                        
                        <div className='feature-card bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:shadow-xl hover:-translate-y-2'>
                            <div className='h-14 w-14 rounded-xl bg-blue-400/20 flex items-center justify-center mb-6'>
                                <svg className="icon-bounce h-8 w-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className='text-xl font-bold text-white mb-3'>Grow Confidence</h3>
                            <p className='text-gray-400'>Develop public speaking, leadership, and collaboration skills that build confidence for future success.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to action */}
            <div className='relative z-10 py-20 px-8 bg-black/30 backdrop-blur-sm'>
                <div className='max-w-3xl mx-auto text-center'>
                    <h2 className='text-3xl md:text-4xl font-bold text-white mb-6'>Ready to unleash your entrepreneurial potential?</h2>
                    <p className='text-xl text-gray-300 mb-10 max-w-2xl mx-auto'>
                        Join Idea Mandir today and start your journey toward becoming the business leader of tomorrow.
                    </p>
                    <Link to="/signup">
                        <button className='px-8 py-4 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition-all duration-300 shadow-lg hover:shadow-yellow-500/20 transform hover:scale-105 hover:-translate-y-1'>
                            Begin Your Journey
                        </button>
                    </Link>
                </div>
            </div>
            <section
        className="bg-gray-100"
      >
        <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
            <div
              className="max-w-lg"
            >
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">About Me</h2>
              <h4 className="text-xl font-bold text-gray-900 sm:text-4xl">Hello, I'm Daiwik!</h4>
              <p className="mt-4 text-gray-600 text-lg">
                I’m a passionate developer and the creative mind behind Olympic Pulse, a platform dedicated to celebrating the Olympic Games and their rich history. Based in Faridabad, Haryana, India, I combine my love for coding with a deep appreciation for sports to bring you a unique and engaging experience centered around the Olympics.
              </p>
            </div>
            <div
              className="mt-12 md:mt-0"
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            >
              <img
                src="https://c4.wallpaperflare.com/wallpaper/264/666/478/3-316-16-9-aspect-ratio-s-sfw-wallpaper-preview.jpg"
                alt="About Us Image"
                className="object-cover rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </section>
            <section
                    className="bg-gray-100"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  >
                    <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
                        <div
                          className="mt-12 md:mt-0"
                          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                        >
                          <img
                            src='https://www.cloudflar.info/aaravali_website/images/faridabad_school.webp'
                            alt="About My School Image"
                            className="object-cover rounded-lg shadow-md h-full w-full"
                          />
                        </div>
                        <div
                          className="flex flex-col w-full items-end"
                          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                        >
                          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl w-[80%]">About My School</h2>
                          <p className="mt-4 text-gray-600 text-lg w-[80%]">
                            Our first school Aravali International School, Faridabad was founded in the year 2004 by Mr. Dhan Singh Bhadana with a vision to provide quality and affordable education to students in Haryana. He inspires the team to dream big and create schools which cultivate a lifelong love for learning and desire to make a positive impact on the world.
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>
        </div>
    );
};

export default Home;