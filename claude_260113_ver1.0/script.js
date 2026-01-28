/**
 * BSTONES Portfolio - JavaScript
 * 스크롤 애니메이션 및 인터랙션 처리
 */

document.addEventListener('DOMContentLoaded', function() {
    // 스크롤 애니메이션을 위한 Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll');
                // 한 번 애니메이션 후 관찰 중지
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 애니메이션 대상 요소들
    const animateElements = document.querySelectorAll(
        '.about-item, .portfolio-item, .timeline-item, .history-content'
    );

    animateElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });

    // 헤더 스크롤 효과
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.5)';
        }
        
        lastScrollY = currentScrollY;
    });

    // 부드러운 스크롤 (포트폴리오 버튼)
    const portfolioBtn = document.querySelector('.portfolio-btn');
    if (portfolioBtn) {
        portfolioBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector('#portfolio');
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // 포트폴리오 아이템 호버 효과
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-10px)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0)';
        });
    });

    // 타임라인 애니메이션
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });

    // Parallax 효과 (KV 섹션)
    const kvSection = document.querySelector('.kv-section');
    const kvContent = document.querySelector('.kv-content');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const kvHeight = kvSection ? kvSection.offsetHeight : 0;
        
        if (scrolled < kvHeight) {
            if (kvContent) {
                kvContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                kvContent.style.opacity = 1 - (scrolled / kvHeight);
            }
        }
    });

    // 소개 섹션 스크롤 트리거
    const aboutItems = document.querySelectorAll('.about-item');
    
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const dot = entry.target.querySelector('.about-dot');
                if (dot) {
                    dot.style.transform = 'scale(1)';
                    dot.style.opacity = '1';
                }
            }
        });
    }, {
        threshold: 0.5
    });

    aboutItems.forEach(item => {
        const dot = item.querySelector('.about-dot');
        if (dot) {
            dot.style.transform = 'scale(0)';
            dot.style.opacity = '0';
            dot.style.transition = 'all 0.5s ease';
        }
        aboutObserver.observe(item);
    });

    // 버블 배경 패럴랙스
    const bubbles = document.querySelectorAll('.bg-bubble');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        bubbles.forEach((bubble, index) => {
            const speed = 0.05 + (index * 0.02);
            bubble.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    console.log('BSTONES Portfolio loaded successfully!');
});

// 이미지 로딩 최적화
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// 페이지 로드 완료 시 실행
window.addEventListener('load', lazyLoadImages);
