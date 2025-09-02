import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LandingPage = () => {
    const nameRef = useRef(null)
    const subtitleRef = useRef(null)
    const backgroundRef = useRef(null)
    const navigate = useNavigate()
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const tl = gsap.timeline()
        const particles = []
        
        tl.from(backgroundRef.current, {
            opacity: 0,
            duration: 2,
            ease: 'power2.out'
        })
        
        .from(nameRef.current, {
             y: 30,
            opacity: 0,
            duration: 2,
            ease: 'power2.out',
            onComplete: () => {
                setIsLoaded(true)
            }
        }, "-=0.5")
        
        .from(subtitleRef.current, {
            y: 30,
            opacity: 0,
            duration: 2,
            ease: 'power2.out'
        }, "-=0.5")

    const createParticles = () => {
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div')
        particle.className = 'absolute w-2 h-2 bg-black/10 rounded-full pointer-events-none'
                particle.style.left = Math.random() * 100 + 'vw'
                particle.style.top = Math.random() * 100 + 'vh'
                backgroundRef.current?.appendChild(particle)
                particles.push(particle)

                gsap.to(particle, {
                    y: -window.innerHeight - 100,
            duration: Math.random() * 10 + 10,
                    repeat: -1,
                    ease: 'none',
                    delay: Math.random() * 5
                })

                gsap.to(particle, {
                    opacity: Math.random() * 0.5 + 0.2,
                    duration: Math.random() * 3 + 2,
                    repeat: -1,
                    yoyo: true,
                    ease: 'power2.inOut'
                })
            }
        }

        createParticles()

        

        let isAnimating = false

        const handleClick = () => {
            if (isAnimating || !nameRef.current || !isLoaded) {
                return
            }
            isAnimating = true
            const expandTl = gsap.timeline()
            expandTl.to(nameRef.current, {
                scale: 200,
                duration: 5,
                ease: 'power2.inOut',
                onComplete: () => {
                    navigate('/home')
                }
            })
            .to("h2", {
                opacity: 0,
                duration: 0.5,
                ease: 'power2.inOut'
            }, 0)
        }

        window.addEventListener('click', handleClick)

        return () => {
            window.removeEventListener('click', handleClick)
            particles.forEach(particle => {
                particle.remove()
            })
        }
    }, [navigate, isLoaded])

    return (
        <div 
            ref={backgroundRef}
            className="relative flex flex-col justify-center items-center h-screen w-screen bg-gradient-to-br from-white via-gray-50 to-white overflow-hidden cursor-pointer"
        >
            <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3csvg width=\"60\" height=\"60\" xmlns=\"http://www.w3.org/2000/svg\"%3e%3cdefs%3e%3cpattern id=\"grid\" width=\"60\" height=\"60\" patternUnits=\"userSpaceOnUse\"%3e%3cpath d=\"m 60 0 l 0 60 l -60 0 l 0 -60 l 60 0 Z m -1 1 l -58 0 l 0 58 l 58 0 l 0 -58 Z\" fill=\"none\" stroke=\"%23000000\" stroke-width=\"0.5\" opacity=\"0.05\"/%3e%3c/pattern%3e%3c/defs%3e%3crect width=\"100%25\" height=\"100%25\" fill=\"url(%23grid)\"/%3e%3c/svg%3e")] opacity-30'></div>
            
            <div className="absolute top-20 left-20 w-20 h-20 border-2 border-black/10 rotate-45 animate-spin" style={{animationDuration: '20s'}}></div>
            <div className="absolute top-40 right-32 w-16 h-16 border-2 border-black/10 rounded-full animate-pulse"></div>
            <div className="absolute bottom-32 left-40 w-24 h-24 border-2 border-black/10 rotate-12 animate-bounce"></div>
            <div className="absolute bottom-20 right-20 w-18 h-18 border-2 border-black/10 rounded-full animate-ping"></div>
            
            <div className="relative z-10 flex flex-col justify-center items-center h-full w-full text-center">
                <div className="opacity-0 pointer-events-none">.</div>
                
                <div className='flex flex-col items-center space-y-4'>
                    <h1
                        id="main-title"
                        ref={nameRef}
                        className='text-9xl font-extrabold text-black tracking-widest'
                    >
                        {isLoaded ? "IDEA MANDIR" : ''}
                    </h1>
                </div>
                <div className='flex flex-col items-center space-y-4'>
                    <h2 
                        ref={subtitleRef}
                        className='text-4xl font-light text-black tracking-wide'
                    >
                        {isLoaded ? 'Socho Aur Buld Karo' : ''}
                    </h2>
                    
                    </div>
                <div className='flex flex-col items-center space-y-4'>
                    <h2 
                        ref={subtitleRef}
                        className='text-4xl font-light text-black tracking-wide'
                    >
                        {isLoaded ? 'Click to see magic' : ''}
                    </h2>
                    
                    </div>
            </div>
        </div>
    )
}

export default LandingPage