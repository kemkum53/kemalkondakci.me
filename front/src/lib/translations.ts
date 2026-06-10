export type Lang = "en" | "tr";

export const translations = {
  en: {
       // Epilepsy Warning
    epilepsyWarning: {
      title: "Photosensitive Epilepsy Warning",
      description: "This website contains visual effects that may trigger seizures in individuals with photosensitive epilepsy. You can enable safe mode to reduce these effects.",
      enableSafeMode: "Enable Safe Mode",
      continueNormal: "Continue Normally",
    },
    // Accessibility
    accessibility: {
      safeMode: "Safe Mode",
      safeModeDescription: "Reduces visual effects for better accessibility",
    },
    // Common
    common: {
      readMore: "Read More",
      backToTop: "Back to Top",
      loading: "Loading...",
    },
    // WIP Page
    wip: {
      title: "Work In Progress",
      subtitle: "This section is currently under development",
      description: "I'm working hard to bring you something amazing. This page will be available soon with exciting content and features.",
      backHome: "Back to Home",
      comingSoon: "Coming Soon",
      features: {
        design: "Modern & Responsive Design",
        performance: "Optimized Performance", 
        accessibility: "Full Accessibility Support"
      }
    },
    // Navbar
    navbar: {
      home: "Home",
      cv: "CV",
      projects: "Projects",
      blog: "Blog",
      contact: "Contact",
      hireMe: "Hire Me",
    },
    // Homepage
    home: {
      name: "Kemal Kondakçı",
      title: "AI Engineer / Software Engineer",
      usp: "Building reliable AI & .NET systems with measurable impact.",
      ctaPrimary: "view my cv",
      ctaSecondary: "contact me",
      sections: {
        about: "About",
        skills: "Skills",
        experience: "Experience",
        contact: "Contact",
        statsYears: "Years Experience",
        statsProjects: "Completed Projects",
      },
      aboutText:
        "I build AI and software that ships. LLM-powered products, real-time computer-vision systems running in the field today, .NET and Python backends, Flutter mobile apps — and the Docker/CI-CD pipelines that put them all live. I take an idea end to end: design it, build it, run it in production.",
      skills: {
        aiEngineering: {
          title: "ai engineering",
          description: "Python, ML/DL, data processing and production-focused model deployment.",
          chips: ["Python", "ML", "DL", "NLP", "CV"]
        },
        backendApis: {
          title: "backend & apis",
          description: "High-performance, reliable REST/GraphQL services with .NET and FastAPI.",
          chips: [".NET", "C#", "FastAPI", "SQL"]
        },
        mlopsDeployment: {
          title: "mlops & deployment",
          description: "Docker, CI/CD, monitoring—ensuring models are stable and trackable in production.",
          chips: ["Docker", "AWS", "CI/CD"]
        }
      }
    },
    // CV Page
    cv: {
      title: "cv",
      skipToContent: "skip to content",
      // Add more CV specific translations as needed
    },
    // Contact Page
    contact: {
      title: "Contact",
      getInTouch: "Get In Touch",
      description: "Let's connect and discuss how we can work together on your next project.",
      form: {
        name: "Name",
        namePlaceholder: "Your name",
        email: "Email",
        emailPlaceholder: "your.email@example.com",
        subject: "Subject",
        subjectPlaceholder: "Project inquiry",
        message: "Message",
        messagePlaceholder: "Tell me about your project...",
        send: "Send Message",
        sending: "Sending...",
        success: "Thanks! Your message has been sent — I'll get back to you soon.",
        error: "There was an error. Please try again or contact me directly.",
      },
      info: {
        email: "Email Me",
        linkedin: "LinkedIn",
        whatsapp: "WhatsApp",
        availability: "Available for hire",
        responseTime: "Usually responds within 24 hours",
        location: "Istanbul, Turkey",
      },
      sections: {
        directContact: "Direct Contact",
        sendMessage: "Send a Message",
      }
    },
    // Footer
    footer: {
      about: "AI Engineer & Software Developer - Building reliable AI & .NET systems with measurable impact.",
      navigation: "Navigation",
      social: "Social",
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
      whatsapp: "WhatsApp",
      goToTop: "Go to top",
      downloadCv: "Download CV",
      copyrightRole: "AI Engineer & Software Developer",
      availableStatus: "🟢 Available for hire",
    },
  },
  tr: {
    // Navbar
    navbar: {
      home: "Ana Sayfa",
      cv: "CV",
      projects: "Projeler",
      blog: "Blog",
      contact: "İletişim",
      hireMe: "Benimle Çalış",
    },
    // Homepage
    home: {
      name: "Kemal Kondakçı",
      title: "YZ Mühendisi / Yazılım Mühendisi",
      usp: "Ölçülebilir etki üreten güvenilir yapay zekâ ve .NET çözümleri geliştiriyorum.",
      ctaPrimary: "CV'mi gör",
      ctaSecondary: "İletişime Geç",
      sections: {
        about: "Hakkımda",
        skills: "Yetenekler",
        experience: "Deneyim",
        contact: "İletişim",
        statsYears: "Yıl Deneyim",
        statsProjects: "Tamamlanan Proje",
      },
      aboutText:
        "Üretime giren yapay zekâ ve yazılım geliştiriyorum. LLM tabanlı ürünler, bugün sahada çalışan gerçek-zamanlı bilgisayarlı görü sistemleri, .NET ve Python backend'leri, Flutter mobil uygulamalar ve hepsini canlıya taşıyan Docker/CI-CD hatları. Bir fikri uçtan uca götürürüm: tasarlar, kodlar, üretimde çalıştırırım.",
      skills: {
        aiEngineering: {
          title: "yz mühendisliği",
          description: "Python, ML/DL, veri işleme ve üretim odaklı model devreye alma.",
          chips: ["Python", "ML", "DL", "NLP", "CV"]
        },
        backendApis: {
          title: "backend & api'lar",
          description: ".NET ve FastAPI ile performanslı, güvenilir REST/GraphQL servisleri.",
          chips: [".NET", "C#", "FastAPI", "SQL"]
        },
        mlopsDeployment: {
          title: "mlops & deployment",
          description: "Docker, CI/CD, ölçümleme—modellerin canlıda stabil ve izlenebilir olması.",
          chips: ["Docker", "AWS", "CI/CD"]
        }
      }
    },
    // CV Page
    cv: {
      title: "cv",
      skipToContent: "içeriğe geç",
      // Add more CV specific translations as needed
    },
    // Contact Page
    contact: {
      title: "İletişim",
      getInTouch: "İletişime Geçin",
      description: "Bir sonraki projenizde nasıl birlikte çalışabileceğimizi konuşmak için bağlantı kuralım.",
      form: {
        name: "İsim",
        namePlaceholder: "İsminiz",
        email: "E-posta",
        emailPlaceholder: "email@ornek.com",
        subject: "Konu",
        subjectPlaceholder: "Proje talebi",
        message: "Mesaj",
        messagePlaceholder: "Projeniz hakkında bana bilgi verin...",
        send: "Mesaj Gönder",
        sending: "Gönderiliyor...",
        success: "Teşekkürler! Mesajın bana ulaştı — en kısa sürede dönüş yapacağım.",
        error: "Bir hata oluştu. Lütfen tekrar deneyin veya doğrudan benimle iletişime geçin.",
      },
      info: {
        email: "E-posta Gönder",
        linkedin: "LinkedIn",
        whatsapp: "WhatsApp",
        availability: "İşe müsait",
        responseTime: "Genellikle 24 saat içinde yanıtlar",
        location: "İstanbul, Türkiye",
      },
      sections: {
        directContact: "Direkt İletişim",
        sendMessage: "Mesaj Gönder",
      }
    },
    // Footer
    footer: {
      about: "Ölçülebilir etki üreten güvenilir yapay zekâ ve .NET çözümleri geliştiriyorum.",
      navigation: "Navigasyon",
      social: "Sosyal",
      email: "E-posta",
      linkedin: "LinkedIn",
      github: "GitHub",
      whatsapp: "WhatsApp",
      goToTop: "Başa Dön",
      downloadCv: "CV İndir",
      copyrightRole: "YZ Mühendisi & Yazılım Geliştirici",
      availableStatus: "🟢 İşe Müsait",
    },
    // Epilepsy Warning
    epilepsyWarning: {
      title: "Fotosensitif Epilepsi Uyarısı",
      description: "Bu web sitesi fotosensitif epilepsisi olan kişilerde nöbet tetikleyebilecek görsel efektler içermektedir. Bu efektleri azaltmak için güvenli modu etkinleştirebilirsiniz.",
      enableSafeMode: "Güvenli Modu Etkinleştir",
      continueNormal: "Normal Şekilde Devam Et",
    },
    // Accessibility
    accessibility: {
      safeMode: "Güvenli Mod",
      safeModeDescription: "Daha iyi erişilebilirlik için görsel efektleri azaltır",
    },
    // Common
    common: {
      readMore: "Devamını Oku",
      backToTop: "Başa Dön",
      loading: "Yükleniyor...",
    },
    // WIP Page
    wip: {
      title: "Geliştirme Aşamasında",
      subtitle: "Bu bölüm şu anda geliştirilmekte",
      description: "Size harika bir şeyler sunmak için çok çalışıyorum. Bu sayfa yakında heyecan verici içerik ve özelliklerle birlikte hazır olacak.",
      backHome: "Ana Sayfaya Dön",
      comingSoon: "Çok Yakında",
      features: {
        design: "Modern ve Duyarlı Tasarım",
        performance: "Optimize Edilmiş Performans",
        accessibility: "Tam Erişilebilirlik Desteği"
      }
    },
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
