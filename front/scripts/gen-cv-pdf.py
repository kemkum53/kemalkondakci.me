# -*- coding: utf-8 -*-
"""Designed one-page A4 CV (HTML) for EN + TR; rendered to PDF by headless Chrome."""
import html, pathlib

import os
_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # front/
PHOTO = "file://" + os.path.join(_ROOT, "public", "me.png")

DATA = {
    "name": "Kemal Kondakçı",
    "en": {
        "title": "AI Engineer · Software Engineer",
        "usp": "Building reliable AI & .NET systems with measurable impact.",
        "about": "AI Engineer & Software Developer specializing in production-grade AI systems and robust .NET applications, with a strong focus on DevOps. I design and ship full-stack products end to end — from LLM-powered backends to cross-platform mobile apps — and run them with Docker, CI/CD pipelines and cloud (AWS) deployments.",
        "labels": {"contact": "Contact", "skills": "Skills", "stack": "Tech Stack", "about": "Profile",
                    "exp": "Experience", "proj": "Selected Projects", "langs": "Languages"},
        "langs": ["Turkish — Native", "English — Professional"],
        "exp": [
            ("Software Development Specialist", "MODSOFT Bilişim", "05/2023 — Present",
             ["AI-powered modules and .NET-based services.", "Performance monitoring & measurable improvements."]),
            ("IT Support Specialist", "QUALA NETWORKS", "03/2022 — 05/2023",
             ["System support, automation and internal tooling."]),
            ("Intern", "İSBAK", "06/2019 — 07/2019", ["Support for R&D processes."]),
        ],
        "proj": [
            ("BUDDAI", "“Living” AI chat core — persona engine, persistent memory & human-like behavior.", "Python · AI/LLM"),
            ("Lucido", "AI dream-interpretation mobile app — token economy with rewarded ads.", "Flutter · FastAPI"),
            ("DarkMatter", "End-to-end Discord bot platform — bot, API & admin panel.", ".NET 10 · CQRS · React"),
            ("Multi-Agent AI System", "Multi-agent orchestration with state-aware agent flows.", "LangGraph · FastAPI · React"),
        ],
    },
    "tr": {
        "title": "YZ Mühendisi · Yazılım Mühendisi",
        "usp": "Ölçülebilir etki üreten güvenilir yapay zekâ ve .NET çözümleri.",
        "about": "Üretim seviyesinde yapay zekâ sistemleri ve sağlam .NET uygulamaları geliştiren, DevOps'a güçlü biçimde odaklanan bir YZ Mühendisi & Yazılım Geliştirici. LLM destekli backend'lerden çok platformlu mobil uygulamalara kadar tam yığın ürünleri uçtan uca tasarlıyor; Docker, CI/CD hatları ve bulut (AWS) ile devreye alıyorum.",
        "labels": {"contact": "İletişim", "skills": "Yetenekler", "stack": "Teknolojiler", "about": "Profil",
                    "exp": "Deneyim", "proj": "Öne Çıkan Projeler", "langs": "Diller"},
        "langs": ["Türkçe — Ana dil", "İngilizce — Profesyonel"],
        "exp": [
            ("Yazılım Geliştirme Uzmanı", "MODSOFT Bilişim", "05/2023 — Güncel",
             ["AI destekli modüller ve .NET tabanlı servisler.", "Performans/izleme ve ölçülebilir iyileştirmeler."]),
            ("Bilgi İşlem Destek Elemanı", "QUALA NETWORKS", "03/2022 — 05/2023",
             ["Sistem desteği, otomasyon ve iç araçlar."]),
            ("Stajyer", "İSBAK", "06/2019 — 07/2019", ["Ar-Ge süreçlerine destek."]),
        ],
        "proj": [
            ("BUDDAI", "“Yaşayan” AI sohbet çekirdeği — persona motoru, kalıcı hafıza, insansı davranış.", "Python · AI/LLM"),
            ("Lucido", "AI rüya yorumlama mobil uygulaması — ödüllü reklam/token ekonomisi.", "Flutter · FastAPI"),
            ("DarkMatter", "Uçtan uca Discord bot platformu — bot, API ve yönetim paneli.", ".NET 10 · CQRS · React"),
            ("Multi-Agent AI System", "Durum-bilinçli ajan akışlarıyla çok-ajanlı orkestrasyon.", "LangGraph · FastAPI · React"),
        ],
    },
}

BARS = [("Python", 92), ("Generative AI / LLM", 90), ("AI-Assisted Development", 90),
        ("DevOps · Docker · CI/CD", 88), ("C# / .NET", 85), ("Machine Learning", 82)]
STACK = ["Python", "C#", "TypeScript", "Dart", "FastAPI", ".NET / ASP.NET", "Flutter", "React", "Next.js",
         "LangGraph", "Docker", "Docker Compose", "CI/CD", "GitHub Actions", "Traefik", "AWS", "Linux"]
CONTACT = [
    ("✉", "kondakci.k@gmail.com"),
    ("⌖", "İstanbul, Türkiye"),
    ("⎇", "github.com/kemkum53"),
    ("in", "linkedin.com/in/kemal-kondakçı"),
]

CSS = """
@page { size: A4; margin: 0; }
* { margin:0; padding:0; box-sizing:border-box; }
html,body{ -webkit-print-color-adjust:exact; print-color-adjust:exact; }
body{ font-family:'Outfit','Helvetica Neue',Arial,sans-serif; color:#1b1f29; }
.page{ width:210mm; height:297mm; display:flex; overflow:hidden; }
/* sidebar */
.side{ width:74mm; background:linear-gradient(165deg,#171436 0%,#0b1020 55%,#141031 100%);
  color:#e8ecff; padding:14mm 8mm; position:relative; }
.side::before{ content:""; position:absolute; inset:0 0 auto 0; height:6mm;
  background:linear-gradient(90deg,#7A3CFF,#00E5FF); }
.avatar{ width:34mm; height:34mm; border-radius:50%; object-fit:cover; display:block; margin:2mm auto 6mm;
  border:1.2mm solid rgba(122,60,255,.55); }
.s-h{ font-family:'Chakra Petch','Outfit',sans-serif; font-size:9pt; letter-spacing:.18em; text-transform:uppercase;
  color:#34e3c9; margin:6mm 0 3mm; padding-bottom:1.4mm; border-bottom:.3mm solid rgba(122,60,255,.4); }
.c-row{ display:flex; gap:2.4mm; align-items:center; font-size:8.6pt; margin:2mm 0; color:#cdd6ea; word-break:break-word; }
.c-ic{ width:5mm; height:5mm; border-radius:1.6mm; background:rgba(122,60,255,.22); color:#bda7ff;
  display:flex; align-items:center; justify-content:center; font-size:7pt; flex:0 0 auto; }
.bar{ margin:2.6mm 0; }
.bar-t{ display:flex; justify-content:space-between; font-size:8.2pt; margin-bottom:1mm; color:#e8ecff; }
.bar-tr{ height:1.6mm; border-radius:2mm; background:rgba(255,255,255,.12); overflow:hidden; }
.bar-f{ height:100%; border-radius:2mm; background:linear-gradient(90deg,#7A3CFF,#00E5FF); }
.tags{ display:flex; flex-wrap:wrap; gap:1.6mm; }
.tag{ font-size:7.6pt; padding:1mm 2.2mm; border-radius:1.6mm; border:.25mm solid rgba(255,255,255,.22);
  color:#dfe6f5; background:rgba(255,255,255,.05); }
/* main */
.main{ flex:1; background:#ffffff; padding:14mm 12mm; }
.name{ font-family:'Chakra Petch','Outfit',sans-serif; font-size:26pt; line-height:1; color:#15182099; color:#171a22; }
.title{ color:#7A3CFF; font-weight:600; font-size:12pt; margin-top:2mm; letter-spacing:.01em; }
.usp{ color:#5b6373; font-size:9.5pt; margin-top:1.6mm; }
.rule{ height:.5mm; background:linear-gradient(90deg,#7A3CFF,#00E5FF 60%,transparent); margin:6mm 0; border-radius:1mm; }
.m-h{ font-family:'Chakra Petch','Outfit',sans-serif; font-size:11pt; letter-spacing:.08em; text-transform:uppercase;
  color:#171a22; margin:6mm 0 3mm; display:flex; align-items:center; gap:3mm; }
.m-h::after{ content:""; flex:1; height:.3mm; background:#e3e6ee; }
.about{ color:#454c5b; font-size:9.6pt; line-height:1.55; }
.exp{ margin-bottom:4mm; }
.exp-top{ display:flex; justify-content:space-between; align-items:baseline; gap:3mm; }
.exp-role{ font-weight:600; color:#1b1f29; font-size:10pt; }
.exp-co{ color:#7A3CFF; font-size:9pt; }
.exp-per{ color:#8a92a3; font-size:8.4pt; white-space:nowrap; }
.exp ul{ margin:1.4mm 0 0 4.5mm; color:#525a6b; font-size:9pt; }
.exp li{ margin:.6mm 0; }
.proj{ margin-bottom:3.4mm; }
.proj-h{ display:flex; justify-content:space-between; align-items:baseline; gap:3mm; }
.proj-n{ font-weight:700; color:#171a22; font-size:10pt; }
.proj-t{ color:#0a9bbf; font-size:8pt; font-weight:600; white-space:nowrap; }
.proj-d{ color:#525a6b; font-size:9pt; margin-top:.6mm; line-height:1.45; }
"""


def esc(s): return html.escape(s, quote=True)


def build(lang):
    d = DATA[lang]; L = d["labels"]
    contacts = "".join(f'<div class="c-row"><span class="c-ic">{esc(i)}</span><span>{esc(v)}</span></div>' for i, v in CONTACT)
    bars = "".join(
        f'<div class="bar"><div class="bar-t"><span>{esc(n)}</span><span>{v}%</span></div>'
        f'<div class="bar-tr"><div class="bar-f" style="width:{v}%"></div></div></div>' for n, v in BARS)
    tags = "".join(f'<span class="tag">{esc(t)}</span>' for t in STACK)
    langs = "".join(f'<div class="c-row"><span class="c-ic">◈</span><span>{esc(x)}</span></div>' for x in d["langs"])
    exps = ""
    for role, co, per, bullets in d["exp"]:
        lis = "".join(f"<li>{esc(b)}</li>" for b in bullets)
        exps += (f'<div class="exp"><div class="exp-top"><span><span class="exp-role">{esc(role)}</span> '
                 f'<span class="exp-co">· {esc(co)}</span></span><span class="exp-per">{esc(per)}</span></div>'
                 f'<ul>{lis}</ul></div>')
    projs = ""
    for n, desc, tech in d["proj"]:
        projs += (f'<div class="proj"><div class="proj-h"><span class="proj-n">{esc(n)}</span>'
                  f'<span class="proj-t">{esc(tech)}</span></div><div class="proj-d">{esc(desc)}</div></div>')
    return f"""<!doctype html><html lang="{lang}"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>{CSS}</style></head><body><div class="page">
<aside class="side">
  <img class="avatar" src="{PHOTO}" alt="">
  <div class="s-h">{esc(L['contact'])}</div>{contacts}
  <div class="s-h">{esc(L['skills'])}</div>{bars}
  <div class="s-h">{esc(L['stack'])}</div><div class="tags">{tags}</div>
  <div class="s-h">{esc(L['langs'])}</div>{langs}
</aside>
<main class="main">
  <div class="name">{esc(DATA['name'])}</div>
  <div class="title">{esc(d['title'])}</div>
  <div class="usp">{esc(d['usp'])}</div>
  <div class="rule"></div>
  <div class="m-h">{esc(L['about'])}</div><p class="about">{esc(d['about'])}</p>
  <div class="m-h">{esc(L['exp'])}</div>{exps}
  <div class="m-h">{esc(L['proj'])}</div>{projs}
</main></div></body></html>"""


import glob, subprocess, tempfile

def _find_chrome():
    pats = [
        os.path.expanduser("~/.cache/puppeteer/chrome/*/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"),
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "/usr/bin/google-chrome", "/usr/bin/chromium",
    ]
    for pat in pats:
        hits = sorted(glob.glob(pat))
        if hits:
            return hits[-1]
    raise SystemExit("Chrome bulunamadi (headless render icin gerekli).")

def main():
    chrome = _find_chrome()
    outdir = os.path.join(_ROOT, "public", "cv")
    os.makedirs(outdir, exist_ok=True)
    for lang, suffix in (("en", "EN"), ("tr", "TR")):
        with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False, encoding="utf-8") as f:
            f.write(build(lang)); htmlpath = f.name
        out = os.path.join(outdir, f"Kemal-Kondakci-CV-{suffix}.pdf")
        subprocess.run([chrome, "--headless", "--disable-gpu", "--no-sandbox",
                        "--no-pdf-header-footer", f"--print-to-pdf={out}", htmlpath],
                       check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        os.unlink(htmlpath)
        print("wrote", out)

if __name__ == "__main__":
    main()
