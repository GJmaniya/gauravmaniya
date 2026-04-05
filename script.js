// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

gsap.registerPlugin(TextPlugin, ScrollTrigger);
document.addEventListener("DOMContentLoaded", () => {
    // 0. Preloader Animation
    const preloaderTimeline = gsap.timeline();
    const loaderLogo = document.querySelector(".loader-logo");
    const navbarLogo = document.querySelector(".logo");

    preloaderTimeline
        .to(".loader-bar", {
            left: "0%",
            duration: 1.5,
            ease: "power2.inOut"
        })
        .add(() => {
            // Calculate fly-in transition path
            const navRect = navbarLogo.getBoundingClientRect();
            const loaderRect = loaderLogo.getBoundingClientRect();

            // Distances for the center of the logo
            const deltaX = navRect.left + navRect.width / 2 - (loaderRect.left + loaderRect.width / 2);
            const deltaY = navRect.top + navRect.height / 2 - (loaderRect.top + loaderRect.height / 2);
            const targetScale = navRect.width / loaderRect.width;

            const t = gsap.timeline();

            // First, move and scale the logo
            t.to(loaderLogo, {
                x: deltaX,
                y: deltaY,
                scale: targetScale,
                duration: 1.4,
                ease: "expo.inOut"
            })
                // Fade the bar and subtext while moving
                .to(".loader-bar-container, .loader-subtext", {
                    opacity: 0,
                    duration: 0.4,
                    ease: "power2.in"
                }, 0)
                // Near the end of the logo flight, reveal the site
                .to("#preloader", {
                    backgroundColor: "rgba(0,0,0,0)",
                    duration: 0.8,
                    ease: "power2.inOut"
                }, "-=0.6")
                .set(navbarLogo, { opacity: 1 })
                .set(loaderLogo, { opacity: 0 })
                .to("#preloader", {
                    display: "none",
                    duration: 0
                })
                .set("body", {
                    className: "-=loading"
                });
        }, "+=0.3");

    // Hide navbar logo initially for the transition
    gsap.set(navbarLogo, { opacity: 0 });

    // Reveal original hidden elements
    const hiddenElements = document.querySelectorAll('.hidden-element');
    hiddenElements.forEach(el => {
        el.classList.remove('hidden-element');
    });

    // Enhanced Hero Reveal
    const heroTl = gsap.timeline({ delay: 1.4 }); // Start after preloader logo settles
    heroTl.from(".hero-content .name", {
        y: 80,
        opacity: 0,
        filter: "blur(20px)",
        scale: 0.95,
        duration: 1.5,
        ease: "expo.out"
    })
        .add(() => {
            const typingTl = gsap.timeline({ repeat: -1 });
            const cursor = document.querySelector(".cursor");
            const textElement = document.querySelector(".typing-text");
            const fullText = "AI / ML Engineer";
            // Fast, Soft Sine reveal (0.5s)
            typingTl
                // FORCE CURSOR VISIBLE BEFORE TYPING
                .add(() => {
                    gsap.killTweensOf(cursor);
                    gsap.set(cursor, { opacity: 1 });
                })
                .to({}, {
                    duration: 0.5,
                    ease: "sine.inOut",
                    onUpdate: function() {
                        const prog = this.progress();
                        const len = Math.round(fullText.length * prog);
                        textElement.innerText = fullText.substring(0, len);
                    }
                })
                // Start blinking when done
                .add(() => {
                    gsap.to(cursor, {
                        opacity: 0,
                        repeat: -1,
                        yoyo: true,
                        duration: 0.5,
                        ease: "steps(1)"
                    });
                })
                // Wait 4s
                .to({}, { duration: 4 })
                // FORCE CURSOR VISIBLE BEFORE BACKSPACING
                .add(() => {
                    gsap.killTweensOf(cursor);
                    gsap.set(cursor, { opacity: 1 });
                })
                .to({}, {
                    duration: 0.5,
                    ease: "sine.inOut",
                    onUpdate: function() {
                        const prog = 1 - this.progress();
                        const len = Math.round(fullText.length * prog);
                        textElement.innerText = fullText.substring(0, len);
                    }
                })
                // Start blinking again when fully erased
                .add(() => {
                    gsap.to(cursor, {
                        opacity: 0,
                        repeat: -1,
                        yoyo: true,
                        duration: 0.5,
                        ease: "steps(1)"
                    });
                })
                .to({}, { duration: 1 });
        })
        .from(".hero-content .summary", {
            y: 40,
            opacity: 0,
            filter: "blur(10px)",
            duration: 1.2,
            ease: "expo.out"
        }, "-=0.2")
        .from(".hero-buttons .btn", {
            y: 30,
            opacity: 0,
            stagger: 0.1,
            duration: 1,
            ease: "expo.out"
        }, "-=0.8");

    // Navigation Animation
    gsap.from(".glass-nav", {
        duration: 1,
        y: -100,
        opacity: 0,
        ease: "power3.out"
    });

    // Premium Batch Reveal Animations
    // Pre-hide elements
    gsap.set(".premium-card:not(#github-grid .premium-card), .timeline-item", { y: 60, opacity: 0, scale: 0.98 });
    gsap.set(".section-title", { y: 40, opacity: 0, filter: "blur(5px)" });

    ScrollTrigger.batch(".premium-card:not(#github-grid .premium-card), .timeline-item", {
        onEnter: batch => gsap.to(batch, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "back.out(1.2)"
        }),
        start: "top 85%"
    });

    ScrollTrigger.batch(".section-title", {
        onEnter: batch => gsap.to(batch, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1,
            ease: "power3.out"
        }),
        start: "top 90%"
    });

    // Subtle Grid Background Parallax
    gsap.to(".grid-background", {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: true
        }
    });

    // Smooth Scrolling for Nav Links
    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for navbar height
                    behavior: 'smooth'
                });
            }
        });
    });

    // Fetch Projects using static data instead of GitHub API
    async function fetchGitHubProjects() {
        const githubContainer = document.getElementById('github-grid');
        if (!githubContainer) return;

        try {
            githubContainer.innerHTML = ''; // Clear loading state

            // Static array of projects mimicking GitHub data structure
            const filteredData = [
                { name: 'digital-attendance', html_url: '#', language: 'Python' },
                { name: 'stock-price', html_url: '#', language: 'Python' },
                { name: 'page-scroller', html_url: '#', language: 'JavaScript' },
                { name: 'virtual-mouse', html_url: '#', language: 'Python' },
                { name: 'gmail-bot', html_url: '#', language: 'Python' },
                { name: 'tic-tac-toe', html_url: '#', language: 'Python' }
            ];

            const projectMetadata = {
                'digital-attendance': {
                    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
                    desc: 'A robust digital attendance system showing charts and user profiles, designed to track user check-ins securely.'
                },
                'stock-price': {
                    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
                    desc: 'Machine learning models designed to forecast financial market trends accurately with a glowing UI.'
                },
                'page-scroller': {
                    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
                    desc: 'Voice-controlled page scrolling script for hands-free navigation using SpeechRecognition.'
                },
                'virtual-mouse': {
                    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
                    desc: 'Computer vision application mapping hand gestures to control the system mouse reliably.'
                },
                'gmail-bot': {
                    image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&w=1200&q=80',
                    desc: 'Automated AI email assistant capable of reading and organizing your inbox seamlessly.'
                },
                'tic-tac-toe': {
                    image: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800"><defs><filter id="glow"><feGaussianBlur stdDeviation="6" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="800" height="800" fill="transparent"/><g transform="translate(150, 150)"><rect x="156" y="0" width="4" height="500" rx="2" fill="#334155"/><rect x="340" y="0" width="4" height="500" rx="2" fill="#334155"/><rect x="0" y="156" width="500" height="4" rx="2" fill="#334155"/><rect x="0" y="340" width="500" height="4" rx="2" fill="#334155"/><g stroke="#fff" stroke-width="12" stroke-linecap="round" filter="url(#glow)"><line x1="45" y1="45" x2="105" y2="105"/><line x1="105" y1="45" x2="45" y2="105"/></g><circle cx="250" cy="75" r="35" stroke="#38bdf8" stroke-width="12" fill="none" filter="url(#glow)"/><g stroke="#fff" stroke-width="14" stroke-linecap="round" filter="url(#glow)"><line x1="215" y1="215" x2="285" y2="285"/><line x1="285" y1="215" x2="215" y2="285"/></g><circle cx="430" cy="430" r="35" stroke="#38bdf8" stroke-width="12" fill="none" filter="url(#glow)"/></g></svg>'),
                    desc: 'A futuristic classic game built with a sleek glassmorphic UI and an intelligent AI opponent.'
                }
            };

            function getMetaData(repoName) {
                const lowerName = repoName.toLowerCase();
                for (let key in projectMetadata) {
                    if (lowerName.includes(key)) {
                        return projectMetadata[key];
                    }
                }
                return {
                    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80',
                    desc: 'Check out my awesome open source project on GitHub.'
                };
            }

            githubContainer.innerHTML = '';

            const introWrapper = document.createElement('div');
            introWrapper.className = 'github-page-wrapper';
            introWrapper.style.width = '100vw';
            introWrapper.style.height = '100vh';
            introWrapper.style.display = 'flex';
            introWrapper.style.justifyContent = 'center';
            introWrapper.style.alignItems = 'center';
            introWrapper.style.flexShrink = '0';
            introWrapper.style.backgroundColor = 'transparent';
            introWrapper.innerHTML = `<h2 style="font-size: clamp(4rem, 8vw, 8rem); font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em;">Open Source Work</h2>`;
            githubContainer.appendChild(introWrapper);

            filteredData.forEach((repo, index) => {
                const pageWrapper = document.createElement('div');
                pageWrapper.className = 'github-page-wrapper';
                pageWrapper.style.width = '100vw';
                pageWrapper.style.height = '100vh';
                pageWrapper.style.display = 'flex';
                pageWrapper.style.alignItems = 'center';
                pageWrapper.style.flexShrink = '0';

                const meta = getMetaData(repo.name);

                // Format the project name by replacing hyphens with spaces and capitalizing gracefully
                const formattedName = repo.name.replace(/-/g, ' ').trim().replace(/\b\w/g, char => char.toUpperCase());

                pageWrapper.innerHTML = `
                    <div style="flex: 1; height: 100vh; overflow: hidden; position: relative;" class="project-split-left">
                        <img src="${meta.image}" alt="${formattedName}" class="project-img" style="width: 100%; height: 100%; object-fit: cover; object-position: center; transform: scale(1.3); mask-image: linear-gradient(to right, black 50%, transparent 100%); -webkit-mask-image: linear-gradient(to right, black 50%, transparent 100%);">
                    </div>
                    <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 0 10vw 0 5vw; z-index: 2; background: transparent;" class="project-split-right">
                        <div class="project-header" style="margin-bottom: 0.5rem;">
                            <h3 style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding-right: 10px; font-size: 3.5rem; margin-bottom: 0.5rem;" title="${formattedName}">
                                <a href="${repo.html_url}" target="_blank" style="color: #fff; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color='#fff'">${formattedName}</a>
                            </h3>
                        </div>
                        <p class="tech-stack" style="font-size: 1.2rem; margin-bottom: 2rem; color: var(--accent);">${repo.language || 'Open Source'}</p>
                        <p style="color: var(--text-secondary); font-size: 1.25rem; line-height: 1.8; margin-bottom: 3.5rem; display: -webkit-box; -webkit-line-clamp: 6; -webkit-box-orient: vertical; overflow: hidden;">${meta.desc}</p>
                        <a href="${repo.html_url}" target="_blank" class="btn secondary-btn" style="padding: 1rem 2.5rem; font-size: 1.15rem; width: fit-content;"><i class="fab fa-github"></i> View Repository</a>
                    </div>
                `;

                githubContainer.appendChild(pageWrapper);

                let interactiveElements = [...pageWrapper.querySelectorAll('a')];
                interactiveElements.forEach(el => {
                    el.addEventListener('mouseenter', () => {
                        document.querySelector('.custom-cursor')?.classList.add('hover');
                        document.querySelector('.custom-cursor-follower')?.classList.add('hover');
                    });
                    el.addEventListener('mouseleave', () => {
                        document.querySelector('.custom-cursor')?.classList.remove('hover');
                        document.querySelector('.custom-cursor-follower')?.classList.remove('hover');
                    });
                });
            });

            // Implement Horizontal Scroll Animation
            setTimeout(() => {
                const container = document.querySelector("#github-grid");
                const wrapper = document.querySelector(".github-scroll-wrapper");
                const wrappers = gsap.utils.toArray("#github-grid .github-page-wrapper");

                if (container && wrapper && wrappers.length > 0) {
                    let scrollWidth = container.scrollWidth - wrapper.offsetWidth;

                    // GSAP matchMedia for Responsive handling
                    let mm = gsap.matchMedia();

                    mm.add("(min-width: 1025px)", () => {
                        // Create a seamless horizontal scroll effect on vertical scroll
                        let scrollTween = gsap.to(container, {
                            x: -scrollWidth,
                            ease: "none",
                            scrollTrigger: {
                                trigger: "#github-projects",
                                pin: true,
                                scrub: 1,
                                snap: 1 / (wrappers.length - 1),
                                end: () => "+=" + scrollWidth,
                                invalidateOnRefresh: true,
                                start: "center center",
                            }
                        });

                        // Add smooth cinematic parallax scrub for full-bleed background images
                        wrappers.forEach((wrap) => {
                            const imgContainer = wrap.querySelector('img');
                            if (imgContainer) {
                                gsap.fromTo(imgContainer,
                                    { x: '-20%' },
                                    {
                                        x: '20%',
                                        ease: "none",
                                        scrollTrigger: {
                                            trigger: wrap,
                                            containerAnimation: scrollTween,
                                            start: "left right",
                                            end: "right left",
                                            scrub: true
                                        }
                                    }
                                );
                            }
                        });
                    });
                }
            }, 100);

        } catch (error) {
            githubContainer.innerHTML = `
                <div class="premium-card project-card" style="text-align: center; width: 100%;">
                    <p>Failed to load projects.</p>
                </div>
            `;
            console.error('Error loading projects:', error);
        }
    }

    fetchGitHubProjects();
});

// --- Attractive UI Interactions --- //

// 1. Custom Cursor
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

const follower = document.createElement('div');
follower.classList.add('custom-cursor-follower');
document.body.appendChild(follower);

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
});

gsap.ticker.add(() => {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;
});

// Apply hover scale to all interactive elements
document.querySelectorAll('a, button, .btn, .premium-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        follower.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        follower.classList.remove('hover');
    });
});

// 2. Card Spotlight Hover Effect
for (const card of document.querySelectorAll(".premium-card")) {
    card.onmousemove = e => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
        card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    };
}

// 3. Theme Switch Logic
const themeBtns = document.querySelectorAll('.theme-btn');
themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        themeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (btn.id === 'theme-light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else if (btn.id === 'theme-dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    });
});

// --- Mobile Navigation --- //
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links li a');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
    });

    navLinksItems.forEach(item => {
        item.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
}
// --- Modern Magnetic Buttons --- //
const magneticButtons = document.querySelectorAll('.btn, .theme-btn');
magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
            x: x * 0.4,
            y: y * 0.4,
            scale: 1.05,
            duration: 0.6,
            ease: "power3.out"
        });
    });

    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "elastic.out(1, 0.3)"
        });
    });
});

// --- Background Grid Parallax --- //
gsap.to(".grid-background", {
    yPercent: -15,
    ease: "none",
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: true
    }
});