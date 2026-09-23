// --- i18n source of truth ---
// window.AURA_I18N.en / .ja map content keys to strings.
// Japanese values are placeholders that mirror English until real
// translations are provided, section by section. Fill in the `ja` object
// below in place, key by key; nothing else in the codebase needs to change.
window.AURA_I18N = {
  en: {
    meta: {
      title: "Aura Sites — Custom Website Design, Built Fast",
      description: "Custom website design without templates. Aura Sites builds fast, handcrafted sites for businesses in Japan and beyond, from single-page launches to full custom builds."
    },
    nav: {
      work: "Work",
      process: "Process",
      pricing: "Pricing",
      contact: "Get started"
    },
    hero: {
      introCaption: "Aura Sites",
      h1: "Websites that feel <em>handcrafted</em>,<br>at a pace that isn't",
      sub: "Studio-quality design, delivered in days, not months.",
      ctaPrimary: "Start a project",
      ctaSecondary: "See the work",
      scrollCue: "scroll to enter"
    },
    process: {
      heading: "Watch a site come together",
      body: "Every project starts from a blank canvas and takes shape in front of you. No templates, no recycled layouts.",
      tierToggleAriaLabel: "Pricing tier",
      tabLaunch: "Launch",
      tabGrow: "Grow",
      tabStudio: "Studio",
      stepDiscovery: "Discovery call",
      stepFirstLook: "First look",
      stepLive: "Live",
      daysLaunch: ["Day 1", "Day 3", "Day 7"],
      daysGrow: ["Day 1", "Day 5", "Day 10–14"],
      daysStudio: ["Day 1", "Scoped with you", "Scoped with you"]
    },
    work: {
      heading: "Recent work",
      body: "A few examples of how far the same process can stretch, from editorial and warm to clean and functional.",
      jinguTitle: "JINGŪ",
      jinguDesc: "Premium matcha brand, editorial Japanese aesthetic, multi-page.",
      jinguTag1: "Brand",
      jinguTag2: "E-commerce",
      jinguAlt: "Aura Sites custom website design example for the JINGŪ matcha brand, an editorial homepage hero with a bowl of whisked matcha",
      jinguLinkText: "jingumatcha.netlify.app ↗",
      pecTitle: "PEC",
      pecDesc: "Private education concierge for tutoring, IELTS/EIKEN, study abroad.",
      pecTag1: "Education",
      pecTag2: "Concierge",
      pecAlt: "Aura Sites custom website design example for PEC, a private education concierge site for Tokyo families",
      pecLinkText: "View site ↗",
      ljTitle: "Luxury Japan",
      ljDesc: "Bespoke inbound travel concierge. AI/DX tooling and workflow automation for their team.",
      ljTag1: "Travel",
      ljTag2: "AI/DX",
      ljAlt: "Aura Sites custom website design example for Luxury Japan, a homepage hero with a Zen rock garden and a blossoming weeping cherry tree beside a traditional plaster wall",
      ljLinkText: "luxuryjapan.tv ↗"
    },
    socialProof: {
      stat1Number: "3 to 14",
      stat1Label: "days from kickoff to launch",
      stat2Number: "100%",
      stat2Label: "custom-designed, no templates",
      stat3Number: "3",
      stat3Label: "fixed pricing tiers, no surprises",
      quotes: [
        { text: "\"They took a vague idea and gave it shape in days, not months. It felt like working with a design studio, not a software vendor.\"", attr: "Founder, independent retail brand" },
        { text: "\"The process was refreshingly simple. One call, a few quiet days of progress, then a site that actually looked like us.\"", attr: "Operator, hospitality business" },
        { text: "\"I've worked with three agencies before. This was the first time nobody tried to talk me into features I didn't need.\"", attr: "Owner, boutique fitness studio" },
        { text: "\"They pushed back on my first idea, and they were right to. The final site converts better than anything we've had.\"", attr: "Partner, consulting firm" },
        { text: "\"Every revision came back within a day. I stopped worrying about the timeline after the first week.\"", attr: "Broker, real estate agency" },
        { text: "\"Parents mention the site before they mention the tutoring. That's not something I expected to hear.\"", attr: "Director, tutoring center" },
        { text: "\"It doesn't look like a template with our logo on it. It looks like something built specifically for us.\"", attr: "Owner, wellness studio" },
        { text: "\"Reservations picked up the week the new site went live. I wasn't expecting a number I could actually point to.\"", attr: "Owner, restaurant group" },
        { text: "\"They asked better questions about my work than most clients do. The site reflects that.\"", attr: "Photographer, independent studio" },
        { text: "\"We had a tiny budget and a real deadline. They treated both like they mattered.\"", attr: "Program lead, nonprofit organization" }
      ]
    },
    pricing: {
      heading: "Pricing",
      body: "Fixed packages, not open-ended quotes, so you know what you're getting before we start.",
      launch: {
        name: "Launch",
        desc: "A single-page or small brand site, done right.",
        price: "¥180,000<span>〜</span>",
        turnaround: "~3 day turnaround",
        feature1: "Up to 3 pages",
        feature2: "Custom design, no templates",
        feature3: "Mobile-optimized",
        feature4: "1 revision round",
        feature5: "Professional translation included (English + more)",
        cta: "Get started"
      },
      grow: {
        badge: "Most popular",
        name: "Grow",
        desc: "A full multi-page site for a growing business.",
        price: "¥480,000<span>〜</span>",
        turnaround: "~1–2 week turnaround",
        feature1: "Up to 8 pages",
        feature2: "Custom design, no templates",
        feature3Pre: "CMS",
        feature3Post: "for easy updates",
        feature4: "Copywriting support",
        feature5: "3 revision rounds",
        feature6: "Professional translation included (English + more)",
        cta: "Get started"
      },
      studio: {
        name: "Studio",
        desc: "Complex builds, e-commerce, or bespoke interaction.",
        price: "Custom quote",
        turnaround: "Scoped per project",
        feature1: "Unlimited pages",
        feature2: "E-commerce &amp; integrations",
        feature3: "Bespoke interaction &amp; motion",
        feature4: "Dedicated support",
        feature5: "Professional translation included (English + more)",
        cta: "Talk to us"
      }
    },
    globalReach: {
      heading: "Reach more customers, in their language",
      body: "Many of our clients are Japanese restaurants and small businesses looking to reach more visitors, in English and beyond. Every Aura Sites project includes professional translation, done in partnership with Asiatis, a translation agency with over 25 years of experience across Japanese, English, and other languages. Your site won't just look great, it'll be understood correctly by the customers you're trying to reach."
    },
    hosting: {
      title: "Hosting",
      bodyPre: "An optional add-on, independent of your plan. Turn it on now or add it later. You'll also need a domain",
      bodyPost: "pointing at your site.",
      amount: "¥3,500–5,000",
      period: "/month"
    },
    tooltips: {
      cms: "A simple dashboard for editing your own text and photos later, no coding needed.",
      cmsAriaLabel: "What's a CMS?",
      hosting: "Where your website actually lives online. Without it, your site can't go live.",
      hostingAriaLabel: "What's hosting?",
      domain: "Your website's address, what people type to find you, like aurasites.com.",
      domainAriaLabel: "What's a domain?"
    },
    faq: {
      heading: "Questions, answered",
      q1: "How fast can you actually turn this around?",
      a1: "Turnaround for custom website design depends on your tier. Launch sites typically go live within three days, Grow sites within one to two weeks, and Studio builds are scoped individually given how much they can vary.",
      q2: "How many rounds of revisions do I get?",
      a2: "Launch includes one round of revisions, Grow includes three, and Studio is scoped to fit your custom website design needs. Additional rounds can always be added if required.",
      q3: "What do you need from me to get started?",
      a3: "We begin with a short discovery call to understand your goals for your custom website design. From there, it helps to have your logo, photos, brand colors, existing copy, and access to your domain or hosting account if available. If you don't have these yet, we're happy to help fill in the gaps.",
      q4: "What's your refund policy?",
      a4: "If you cancel before we deliver the first concept for your custom website design, you'll receive a full refund, as minimal work will have taken place. Once the First Look is delivered, that design and development time represents completed work, so it becomes non-refundable from that point forward, even if you choose not to continue.",
      q5: "Do you offer the website in other languages?",
      a5: "Yes, this is included in every project, not an extra cost. We partner with Asiatis, a translation agency with over 25 years of experience, to make sure your site reads naturally and accurately for international customers, not just machine-translated."
    },
    whyNotTemplate: {
      heading: "Not another template",
      body: "Templates start with someone else's decisions already made. We start with yours, then build backward into a site shaped entirely around your business, not a theme you're renting."
    },
    footer: {
      tagline: "Websites that feel handcrafted. At a pace that isn't.",
      copyright: "© 2026 Aura Sites. All rights reserved.",
      privacyLink: "Privacy policy"
    },
    privacy: {
      pageTitle: "Privacy policy | Aura Sites",
      backLink: "&larr; Back to home",
      title: "Privacy policy",
      effectiveDate: "Effective date: September 16, 2026",
      intro: "Aura Sites (\"we\", \"us\", \"our\") respects your privacy. This policy explains what information we collect through this website, why we collect it, and how it's handled.",
      collectHeading: "Information we collect",
      collectQuestionnaireIntro: "When you fill out our project questionnaire, we collect:",
      collectQuestionnaire1: "Your name and email address",
      collectQuestionnaire2: "Your business name and a description of your business",
      collectQuestionnaire3: "Answers about your project's scope, complexity, and design preferences",
      collectQuestionnaire4: "Files you choose to upload, such as a logo or photos",
      collectQuestionnaire5: "Optionally, a domain name and hosting preference",
      collectBookingIntro: "When you book a discovery call through our scheduling tool, we collect:",
      collectBooking1: "Your name and email address",
      collectBooking2: "The date and time of your booking",
      collectPaymentNote: "We do not collect payment information through this website. Any billing details are handled separately, directly with you.",
      useHeading: "How we use your information",
      useIntro: "We use the information above only to:",
      use1: "Respond to your inquiry and evaluate your project",
      use2: "Schedule and conduct a discovery call with you",
      use3: "Deliver the web design services you've engaged us for, if we move forward together",
      useNoSale: "We do not sell your information, and we do not use it for advertising.",
      thirdPartyHeading: "Third-party services",
      thirdPartyIntro: "We rely on a small number of trusted service providers to run this site and deliver our services. Your information may be processed by:",
      thirdParty1: "Netlify, our website host, which stores and delivers questionnaire submissions to us",
      thirdParty2: "Cal.com, our scheduling tool, which manages bookings for discovery calls",
      thirdParty3: "Google, via Cal.com's calendar integration, to create calendar events and generate video call links",
      thirdPartyOutro: "These providers may store or process data outside Japan. We only work with providers that maintain reasonable data protection standards, and we do not share your information with any other third party without your consent, except where required by law.",
      cookiesHeading: "Cookies and local storage",
      cookiesBody: "This site uses limited local browser storage for functional purposes only, such as remembering your language preference (English or Japanese) and whether you've already seen certain page animations. We do not currently use tracking cookies or third-party analytics that identify individual visitors. If this changes in the future, we will update this policy accordingly.",
      retentionHeading: "Data retention",
      retentionBody: "We retain your information for as long as necessary to respond to your inquiry or, if we work together, for the duration of our engagement and a reasonable period afterward for record-keeping purposes. You can request deletion of your information at any time, as described below.",
      rightsHeading: "Your rights",
      rightsBody: "You may request access to, correction of, or deletion of your personal information by contacting us at <a href=\"mailto:aurasitesstudio@gmail.com\">aurasitesstudio@gmail.com</a>. We will respond within a reasonable timeframe.",
      changesHeading: "Changes to this policy",
      changesBody: "We may update this policy from time to time. The effective date above reflects the most recent version.",
      contactHeading: "Contact",
      contactBody: "Questions about this policy can be sent to <a href=\"mailto:aurasitesstudio@gmail.com\">aurasitesstudio@gmail.com</a>."
    },
    quiz: {
      modalAriaLabel: "Start a project",
      closeAriaLabel: "Close",
      phaseBasics: "Basics",
      phaseScope: "Scope",
      phaseStyleTimeline: "Style",
      phaseRecommendation: "Recommendation",
      common: {
        back: "Back",
        next: "Next",
        yes: "Yes",
        no: "No",
        notSure: "Not sure"
      },
      businessName: {
        question: "What's your business called?",
        placeholder: "e.g. Aura Sites",
        skipToBooking: "Already know what you need? Skip straight to booking a call"
      },
      description: {
        question: "Describe it in one line",
        placeholder: "e.g. A cozy neighborhood bakery specializing in sourdough"
      },
      email: {
        question: "What's the best email to reach you at?",
        placeholder: "you@example.com"
      },
      hasLogo: {
        question: "Do you have a logo already?"
      },
      size: {
        question: "Roughly how big is this?",
        one: "One page",
        few: "A few pages (3 to 5)",
        full: "A full site (6+, maybe a blog)"
      },
      pagesChecklist: {
        question: "Which pages do you think you'll need?",
        home: "Home",
        about: "About",
        services: "Services",
        pricing: "Pricing",
        testimonials: "Testimonials",
        contact: "Contact",
        blog: "Blog",
        faq: "FAQ"
      },
      complexity: {
        question: "Do you need online payments, bookings, or user logins?"
      },
      complexityDetail: {
        question: "Tell us a bit about that",
        placeholder: "e.g. Stripe checkout for 3 products, or a booking calendar"
      },
      vibe: {
        question: "Pick the vibe you're going for",
        clean: "Clean &amp; minimal",
        warm: "Warm &amp; friendly",
        bold: "Bold &amp; modern",
        corporate: "Professional &amp; corporate"
      },
      recommendation: {
        question: "Here's what we'd suggest",
        questionConfirm: "Great choice, here's a quick recap",
        namePlaceholder: "Your name",
        consent: "By submitting, you agree to our <a href=\"/privacy\" target=\"_blank\" rel=\"noopener\">privacy policy</a>.",
        submit: "Submit",
        blurbComplex: "Payments, bookings, or logins need some custom scoping, so Studio is the right fit.",
        blurbStudio: "A full site like this benefits from Studio’s flexibility and unlimited pages.",
        blurbLaunch: "A focused one-page site is exactly what Launch is built for.",
        blurbGrow: "A multi-page site with room to grow fits the Grow tier well."
      },
      postSubmit: {
        question: "You're in",
        logoDesignQuestion: "Would you like us to design one for you?",
        subtext: "Got any photos handy? Drop them now to speed things up, or skip and we'll sort it when we talk.",
        dropzoneLabel: "Drag &amp; drop files here, or click to choose",
        noPhotosLabel: "Don't have photos yet?",
        stockOption: "Use stock photos",
        aiOption: "Use AI-generated",
        domainPlaceholder: "Domain name, if you have one (optional)",
        hostingQuestion: "Interested in hosting?",
        skipBtn: "Skip for now",
        finishBtn: "Finish"
      },
      thanks: {
        headingTemplate: "Thanks, {name}! We'll be in touch soon",
        subtext: "Usually within one business day.",
        continueBtn: "Continue"
      },
      booking: {
        heading: "Let's talk it through",
        subtext: "Book a quick discovery call, no obligation.",
        confirmedHeading: "You're all set",
        confirmedSubtext: "Check your email for the confirmation and calendar invite.",
        skipBtn: "Skip for now, I'll book later",
        doneBtn: "Done"
      }
    }
  },

  ja: {
    meta: {
      title: "オーラサイト｜高品質でスピーディーなホームページ制作",
      description: "テンプレートを使わないオリジナルのホームページ制作。オーラサイトは日本国内外の事業者向けに、スピーディーで高品質なウェブサイトを制作します。"
    },
    nav: {
      work: "実績",
      process: "制作の流れ",
      pricing: "料金",
      contact: "はじめる"
    },
    hero: {
      introCaption: "Aura Sites",
      h1: "手仕事のような<br><em>丁寧さ</em>を、<br>驚くほどの速さで",
      sub: "スタジオ品質のデザインを、数ヶ月ではなく数日で。",
      ctaPrimary: "プロジェクトを始める",
      ctaSecondary: "実績を見る",
      scrollCue: "スクロールして進む"
    },
    process: {
      heading: "サイトが形になっていく様子を",
      body: "どのプロジェクトも、白紙の状態からあなたの目の前で形になっていきます。テンプレートも、使い回しのレイアウトもありません。",
      tierToggleAriaLabel: "料金プラン",
      tabLaunch: "Launch",
      tabGrow: "Grow",
      tabStudio: "Studio",
      stepDiscovery: "ヒアリング",
      stepFirstLook: "初稿デザイン",
      stepLive: "公開",
      daysLaunch: ["1日目", "3日目", "7日目"],
      daysGrow: ["1日目", "5日目", "10〜14日目"],
      daysStudio: ["1日目", "ご相談の上決定", "ご相談の上決定"]
    },
    work: {
      heading: "最近の実績",
      body: "同じプロセスがどれほど幅広い表現に対応できるか、いくつかの実例でご紹介します。編集的で温かみのあるものから、クリーンで機能的なものまで。",
      jinguTitle: "JINGŪ",
      jinguDesc: "高級抹茶ブランド。和の美意識を活かしたエディトリアルデザイン、複数ページ構成。",
      jinguTag1: "ブランド",
      jinguTag2: "EC",
      jinguAlt: "オーラサイトによるホームページ制作事例、JINGŪ（抹茶ブランド）。点てた抹茶が入った茶碗を写した、エディトリアルなトップページのヒーロー画像。",
      jinguLinkText: "jingumatcha.netlify.app ↗",
      pecTitle: "PEC",
      pecDesc: "家庭教師、IELTS・英検対策、留学まで対応する、プライベート教育コンシェルジュ。",
      pecTag1: "教育",
      pecTag2: "コンシェルジュ",
      pecAlt: "オーラサイトによるホームページ制作事例、PEC（東京のご家庭向けプライベート教育コンシェルジュ）。トップページのヒーロー画像。",
      pecLinkText: "サイトを見る ↗",
      ljTitle: "Luxury Japan",
      ljDesc: "オーダーメイドのインバウンド旅行コンシェルジュ。チーム向けにAI/DXツールと業務自動化を構築。",
      ljTag1: "旅行",
      ljTag2: "AI/DX",
      ljAlt: "オーラサイトによるホームページ制作事例、Luxury Japan。しだれ桜と伝統的な土塀を配した、枯山水の庭園を写したトップページのヒーロー画像。",
      ljLinkText: "luxuryjapan.tv ↗"
    },
    socialProof: {
      stat1Number: "3〜14",
      stat1Label: "キックオフから公開までの日数",
      stat2Number: "100%",
      stat2Label: "テンプレートを使わない完全オーダーメイド",
      stat3Number: "3",
      stat3Label: "追加費用のない、明確な3つの料金プラン",
      quotes: [
        { text: "「漠然としたイメージしかなかったのに、数日で形にしてくれました。まるで専属のデザイナーがいるような安心感でした。」", attr: "オーナー、飲食店" },
        { text: "「打ち合わせは一度だけ。あとは静かに進んで、気づいたら私たちらしいサイトが出来上がっていました。」", attr: "経営者、美容サロン" },
        { text: "「予約数がサイト公開直後から増えました。効果を数字で実感できたのは初めてです。」", attr: "支配人、旅館" },
        { text: "「テンプレート感が一切なく、うちのブランドのために作られたと感じます。」", attr: "店主、セレクトショップ" },
        { text: "「保護者の方から、サイトを見て安心したという声をいただくようになりました。」", attr: "塾長、学習塾" },
        { text: "「無駄な機能を勧められることが一度もありませんでした。必要なものだけを、的確に。」", attr: "オーナー、フィットネススタジオ" },
        { text: "「最初の案には率直に意見をくれました。結果的にそれが正解でした。」", attr: "代表、コンサルティング会社" },
        { text: "「修正の対応が早く、スケジュールへの不安がすぐになくなりました。」", attr: "仲介業者、不動産会社" },
        { text: "「作品について、他のどのクライアントよりも深く質問してくれました。」", attr: "写真家、フリーランス" },
        { text: "「予算も期限も厳しい中、どちらも真剣に向き合ってくれました。」", attr: "プログラム責任者、NPO法人" }
      ]
    },
    pricing: {
      heading: "料金",
      body: "料金は固定パッケージ制。青天井の見積もりではないので、始める前に内容をしっかりご確認いただけます。",
      launch: {
        name: "Launch",
        desc: "1ページ、または小規模なブランドサイトを、確かな品質で。",
        price: "¥180,000<span>〜</span>",
        turnaround: "約3日で納品",
        feature1: "最大3ページ",
        feature2: "テンプレートを使わないオーダーメイドデザイン",
        feature3: "モバイル最適化",
        feature4: "修正1回",
        feature5: "プロによる翻訳込み（英語ほか対応）",
        cta: "はじめる"
      },
      grow: {
        badge: "人気No.1",
        name: "Grow",
        desc: "成長するビジネスのための、本格的な複数ページサイト。",
        price: "¥480,000<span>〜</span>",
        turnaround: "約1〜2週間で納品",
        feature1: "最大8ページ",
        feature2: "テンプレートを使わないオーダーメイドデザイン",
        feature3Pre: "CMS",
        feature3Post: "で簡単に更新",
        feature4: "コピーライティングサポート",
        feature5: "修正3回",
        feature6: "プロによる翻訳込み（英語ほか対応）",
        cta: "はじめる"
      },
      studio: {
        name: "Studio",
        desc: "複雑な構築、ECサイト、オーダーメイドのインタラクションまで。",
        price: "個別見積もり",
        turnaround: "案件ごとに個別対応",
        feature1: "ページ数無制限",
        feature2: "ECサイト・外部連携",
        feature3: "オーダーメイドのインタラクション・モーション",
        feature4: "専任サポート",
        feature5: "プロによる翻訳込み（英語ほか対応）",
        cta: "ご相談ください"
      }
    },
    globalReach: {
      heading: "もっと多くのお客様に、伝わる言葉で",
      body: "当社のクライアントの多くは、英語をはじめとする海外のお客様にもっと届きたいと考える、日本の飲食店や小規模事業者です。Aura Sitesのすべてのプロジェクトには、プロフェッショナルな翻訳が含まれています。日本語・英語をはじめ25年以上の実績を持つ翻訳会社、Asiatisとの提携によるものです。見た目が美しいだけでなく、届けたいお客様に正しく伝わるサイトをお届けします。"
    },
    hosting: {
      title: "ホスティング",
      bodyPre: "プランとは別のオプションアイテムです。今すぐでも後からでも有効にできます。サイトを公開するには、ドメイン",
      bodyPost: "を指定する必要もあります。",
      amount: "¥3,500〜5,000",
      period: "/月"
    },
    tooltips: {
      cms: "コーディング不要で、あとから自分でテキストや写真を編集できるシンプルな管理画面です。",
      cmsAriaLabel: "CMSとは？",
      hosting: "あなたのウェブサイトが実際に置かれている場所のことです。これがないと、サイトを公開できません。",
      hostingAriaLabel: "ホスティングとは？",
      domain: "ウェブサイトの住所のようなものです。aurasites.comのように、人々があなたを見つけるために入力するものです。",
      domainAriaLabel: "ドメインとは？"
    },
    faq: {
      heading: "よくあるご質問",
      q1: "実際のところ、どのくらいのスピードで対応できますか？",
      a1: "ホームページ制作の納期はプランによって異なります。Launchサイトは通常3日以内に公開、Growサイトは1〜2週間以内に公開となります。Studioのビルドは案件ごとに幅が大きいため、個別にご相談のうえ決定します。",
      q2: "修正は何回までお願いできますか？",
      a2: "Launchプランには修正1回、Growプランには修正3回が含まれています。Studioは案件ごとのホームページ制作の内容に応じて個別に設定します。必要であれば、追加の修正回数をご用意することも可能です。",
      q3: "始めるにあたって、何を用意すればいいですか？",
      a3: "まずは短いヒアリングを行い、ホームページ制作のご要望を伺うところから始めます。そのうえで、ロゴ、写真、ブランドカラー、既存のテキスト、可能であればドメインやホスティングアカウントへのアクセス情報などがあるとスムーズです。まだお持ちでない場合も、私たちがサポートしますのでご安心ください。",
      q4: "返金についてのポリシーを教えてください。",
      a4: "ホームページ制作の最初のデザイン案(初稿デザイン)をお渡しする前にキャンセルされた場合、作業はほとんど発生していないため、全額返金いたします。初稿デザインの提出後は、それまでのデザイン・開発にかかった時間を完了した業務とみなすため、以降キャンセルされた場合でも返金の対象外となります。",
      q5: "他の言語にも対応してもらえますか？",
      a5: "はい、追加費用なしですべてのプロジェクトに含まれています。25年以上の実績を持つ翻訳会社Asiatisと提携し、機械翻訳ではない、海外のお客様にも自然かつ正確に伝わるサイトに仕上げます。"
    },
    whyNotTemplate: {
      heading: "テンプレートは、使わない",
      body: "テンプレートは、すでに他人の判断で組み立てられています。私たちはあなたの意思から出発し、借り物のテーマではなく、あなたのビジネスのためだけに設計されたサイトを、逆算しながら形にしていきます。"
    },
    footer: {
      tagline: "手仕事のような丁寧さを、驚くほどの速さで届けるウェブサイト。",
      copyright: "© 2026 Aura Sites. 無断複写・転載を禁じます。",
      privacyLink: "プライバシーポリシー"
    },
    privacy: {
      pageTitle: "プライバシーポリシー | Aura Sites",
      backLink: "&larr; ホームに戻る",
      title: "プライバシーポリシー",
      effectiveDate: "施行日：2026年9月16日",
      intro: "Aura Sites（以下「当社」といいます）は、お客様のプライバシーを尊重します。本ポリシーでは、当社が本ウェブサイトを通じて収集する情報の内容、収集する理由、およびその取り扱い方法について説明します。",
      collectHeading: "収集する情報",
      collectQuestionnaireIntro: "プロジェクトに関する質問フォームにご記入いただく際、当社は以下の情報を収集します。",
      collectQuestionnaire1: "お名前およびメールアドレス",
      collectQuestionnaire2: "屋号・事業者名および事業内容の説明",
      collectQuestionnaire3: "プロジェクトの規模、複雑さ、デザインの好みに関する回答",
      collectQuestionnaire4: "ロゴや写真など、お客様が任意でアップロードするファイル",
      collectQuestionnaire5: "（任意）ドメイン名およびホスティングに関するご希望",
      collectBookingIntro: "予約ツールを通じてディスカバリーコールをご予約いただく際、当社は以下の情報を収集します。",
      collectBooking1: "お名前およびメールアドレス",
      collectBooking2: "ご予約の日時",
      collectPaymentNote: "当社は本ウェブサイトを通じて決済情報を収集することはありません。請求に関する詳細は、お客様と直接、別途対応いたします。",
      useHeading: "情報の利用目的",
      useIntro: "上記の情報は、以下の目的にのみ利用します。",
      use1: "お問い合わせへの対応およびプロジェクト内容の検討",
      use2: "ディスカバリーコールの日程調整および実施",
      use3: "ご契約いただいた場合における、Webデザインサービスの提供",
      useNoSale: "当社はお客様の情報を第三者に販売することはなく、広告目的で利用することもありません。",
      thirdPartyHeading: "第三者サービスの利用",
      thirdPartyIntro: "当社は、本ウェブサイトの運営およびサービス提供のため、信頼できる少数のサービス提供者を利用しています。お客様の情報は、以下により処理される場合があります。",
      thirdParty1: "Netlify（当社ウェブサイトのホスティングサービス。質問フォームの送信内容を保存し、当社に届けます）",
      thirdParty2: "Cal.com（当社の予約管理ツール。ディスカバリーコールの予約を管理します）",
      thirdParty3: "Google（Cal.comのカレンダー連携機能を通じて、カレンダーへの予定登録およびビデオ通話リンクの生成に利用されます）",
      thirdPartyOutro: "これらのサービス提供者は、日本国外でお客様の情報を保存・処理する場合があります。当社は、適切なデータ保護基準を満たす提供者とのみ連携しており、法令で義務付けられている場合を除き、お客様の同意なく第三者に情報を提供することはありません。",
      cookiesHeading: "Cookieおよびローカルストレージについて",
      cookiesBody: "本ウェブサイトでは、言語設定（日本語または英語）の記憶や、一部のページ演出を既に閲覧済みかどうかの判定など、機能上必要な範囲でのみブラウザのローカルストレージを使用しています。個人を特定するトラッキングCookieや第三者による解析ツールは現在使用しておりません。今後変更が生じた場合は、本ポリシーを改定してお知らせします。",
      retentionHeading: "情報の保存期間",
      retentionBody: "お客様の情報は、お問い合わせへの対応に必要な期間、またはご契約いただいた場合はその契約期間および記録保持のための合理的な期間、保存します。お客様はいつでも、下記の方法によりご自身の情報の削除をご請求いただけます。",
      rightsHeading: "お客様の権利",
      rightsBody: "お客様は、<a href=\"mailto:aurasitesstudio@gmail.com\">aurasitesstudio@gmail.com</a> までご連絡いただくことで、ご自身の個人情報へのアクセス、訂正、削除を請求することができます。当社は合理的な期間内に対応いたします。",
      changesHeading: "本ポリシーの変更",
      changesBody: "当社は、本ポリシーを随時更新することがあります。上記の施行日は、最新版の発行日を示しています。",
      contactHeading: "お問い合わせ",
      contactBody: "本ポリシーに関するご質問は、<a href=\"mailto:aurasitesstudio@gmail.com\">aurasitesstudio@gmail.com</a> までお送りください。"
    },
    quiz: {
      modalAriaLabel: "プロジェクトを始める",
      closeAriaLabel: "閉じる",
      phaseBasics: "基本情報",
      phaseScope: "規模",
      phaseStyleTimeline: "スタイル",
      phaseRecommendation: "ご提案",
      common: {
        back: "戻る",
        next: "次へ",
        yes: "はい",
        no: "いいえ",
        notSure: "未定"
      },
      businessName: {
        question: "屋号やビジネス名を教えてください。",
        placeholder: "例：Aura Sites",
        skipToBooking: "すでにご要望がお決まりの方は、質問をスキップして通話を予約できます"
      },
      description: {
        question: "ひとことで説明してください",
        placeholder: "例：こだわりのサワードウを扱う、街の小さなベーカリー"
      },
      email: {
        question: "ご連絡先のメールアドレスを教えてください",
        placeholder: "you@example.com"
      },
      hasLogo: {
        question: "すでにロゴをお持ちですか？"
      },
      size: {
        question: "だいたいどのくらいの規模ですか？",
        one: "1ページ",
        few: "数ページ（3〜5ページ）",
        full: "本格的なサイト（6ページ以上、ブログを含む場合も）"
      },
      pagesChecklist: {
        question: "必要になりそうなページを教えてください。",
        home: "ホーム",
        about: "会社紹介",
        services: "サービス",
        pricing: "料金",
        testimonials: "お客様の声",
        contact: "お問い合わせ",
        blog: "ブログ",
        faq: "よくある質問"
      },
      complexity: {
        question: "オンライン決済、予約機能、会員ログインなどは必要ですか？"
      },
      complexityDetail: {
        question: "詳しく教えてください",
        placeholder: "例：Stripeを使った商品3点の決済、予約カレンダーなど"
      },
      vibe: {
        question: "目指す雰囲気を選んでください",
        clean: "クリーン＆ミニマル",
        warm: "温かみ＆親しみやすさ",
        bold: "大胆＆モダン",
        corporate: "フォーマル＆コーポレート"
      },
      recommendation: {
        question: "こちらのプランをご提案します",
        questionConfirm: "いい選択ですね。内容を確認しましょう",
        namePlaceholder: "お名前",
        consent: "送信すると、<a href=\"/privacy\" target=\"_blank\" rel=\"noopener\">プライバシーポリシー</a>に同意したものとみなされます。",
        submit: "送信",
        blurbComplex: "決済・予約・ログイン機能には個別の設計が必要なため、Studioプランが最適です。",
        blurbStudio: "このような本格的なサイトには、ページ数無制限で柔軟に対応できるStudioプランが向いています。",
        blurbLaunch: "1ページに絞ったサイトには、Launchプランがぴったりです。",
        blurbGrow: "成長の余地がある複数ページのサイトには、Growプランがよく合います。"
      },
      postSubmit: {
        question: "受付が完了しました",
        logoDesignQuestion: "ロゴのデザインもご依頼になりますか？",
        subtext: "写真の準備はできていますか？今アップロードしていただくとスムーズです。まだの場合はスキップしていただいても、後ほどご相談の際に整理できます。",
        dropzoneLabel: "ここにファイルをドラッグ＆ドロップ、またはクリックして選択",
        noPhotosLabel: "まだ写真がない場合は？",
        stockOption: "ストック写真を使う",
        aiOption: "AI生成画像を使う",
        domainPlaceholder: "ドメイン名（お持ちの場合、任意）",
        hostingQuestion: "ホスティングにご興味はありますか？",
        skipBtn: "今はスキップ",
        finishBtn: "完了"
      },
      thanks: {
        headingTemplate: "{name}様、ありがとうございます！近日中にご連絡いたします",
        subtext: "通常、1営業日以内にご連絡します。",
        continueBtn: "次へ"
      },
      booking: {
        heading: "詳しくお話ししましょう",
        subtext: "気軽なディスカバリーコールを予約しましょう。参加は任意です。",
        confirmedHeading: "予約が完了しました",
        confirmedSubtext: "確認メールとカレンダー招待をご確認ください。",
        skipBtn: "今はスキップして、後で予約する",
        doneBtn: "完了"
      }
    }
  }
};
