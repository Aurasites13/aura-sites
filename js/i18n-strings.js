// --- i18n source of truth ---
// window.AURA_I18N.en / .ja map content keys to strings.
// Japanese values are placeholders that mirror English until real
// translations are provided, section by section. Fill in the `ja` object
// below in place, key by key; nothing else in the codebase needs to change.
window.AURA_I18N = {
  en: {
    nav: {
      work: "Work",
      process: "Process",
      pricing: "Pricing",
      contact: "Contact"
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
      jinguAlt: "JINGŪ homepage hero, an editorial matcha brand site with a bowl of whisked matcha",
      jinguLinkText: "jingumatcha.netlify.app ↗",
      pecTitle: "PEC",
      pecDesc: "Private education concierge for tutoring, IELTS/EIKEN, study abroad.",
      pecTag1: "Education",
      pecTag2: "Concierge",
      pecAlt: "PEC homepage hero, a private education concierge site for Tokyo families",
      pecLinkText: "View site ↗",
      ljTitle: "Luxury Japan",
      ljDesc: "Bespoke inbound travel concierge. AI/DX tooling and workflow automation for their team.",
      ljTag1: "Travel",
      ljTag2: "AI/DX",
      ljAlt: "Luxury Japan homepage hero, a Zen rock garden with a blossoming weeping cherry tree beside a traditional plaster wall",
      ljLinkText: "luxuryjapan.tv ↗"
    },
    socialProof: {
      stat1Number: "3 to 14",
      stat1Label: "days from kickoff to launch",
      stat2Number: "100%",
      stat2Label: "custom-designed, no templates",
      stat3Number: "3",
      stat3Label: "fixed pricing tiers, no surprises",
      quote1Text: "\"They took a vague idea and gave it shape in days, not months. It felt like working with a design studio, not a software vendor.\"",
      quote1Attr: "Founder, independent retail brand",
      quote2Text: "\"The process was refreshingly simple. One call, a few quiet days of progress, then a site that actually looked like us.\"",
      quote2Attr: "Operator, hospitality business"
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
        cta: "Talk to us"
      }
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
      a1: "Turnaround depends on your tier. Launch sites typically go live within three days, Grow sites within one to two weeks, and Studio builds are scoped individually given how much they can vary.",
      q2: "How many rounds of revisions do I get?",
      a2: "Launch includes one round of revisions, Grow includes three, and Studio is scoped to fit the project's needs. Additional rounds can always be added if required.",
      q3: "What do you need from me to get started?",
      a3: "We begin with a short discovery call to understand your goals. From there, it helps to have your logo, photos, brand colors, existing copy, and access to your domain or hosting account if available. If you don't have these yet, we're happy to help fill in the gaps.",
      q4: "What's your refund policy?",
      a4: "If you cancel before we deliver the first design concept, you'll receive a full refund, as minimal work will have taken place. Once the First Look is delivered, that design and development time represents completed work, so it becomes non-refundable from that point forward, even if you choose not to continue."
    },
    whyNotTemplate: {
      heading: "Not another template",
      body: "Templates start with someone else's decisions already made. We start with yours, then build backward into a site shaped entirely around your business, not a theme you're renting."
    },
    footer: {
      tagline: "Websites that feel handcrafted. At a pace that isn't.",
      copyright: "© 2026 Aura Sites. All rights reserved."
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
        placeholder: "e.g. Aura Sites"
      },
      description: {
        question: "Describe it in one line",
        placeholder: "e.g. A cozy neighborhood bakery specializing in sourdough"
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
        namePlaceholder: "Your name",
        emailPlaceholder: "Your email",
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
        closeBtn: "Close"
      }
    }
  },

  ja: {
    nav: {
      work: "実績",
      process: "制作の流れ",
      pricing: "料金",
      contact: "お問い合わせ"
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
      jinguAlt: "JINGŪのトップページ。点てた抹茶が入った茶碗を写した、エディトリアルな抹茶ブランドサイトのヒーロー画像。",
      jinguLinkText: "jingumatcha.netlify.app ↗",
      pecTitle: "PEC",
      pecDesc: "家庭教師、IELTS・英検対策、留学まで対応する、プライベート教育コンシェルジュ。",
      pecTag1: "教育",
      pecTag2: "コンシェルジュ",
      pecAlt: "PECのトップページ。東京のご家庭向け、プライベート教育コンシェルジュサイトのヒーロー画像。",
      pecLinkText: "サイトを見る ↗",
      ljTitle: "Luxury Japan",
      ljDesc: "オーダーメイドのインバウンド旅行コンシェルジュ。チーム向けにAI/DXツールと業務自動化を構築。",
      ljTag1: "旅行",
      ljTag2: "AI/DX",
      ljAlt: "Luxury Japanのトップページ。しだれ桜と伝統的な土塀を配した、枯山水の庭園を写したヒーロー画像。",
      ljLinkText: "luxuryjapan.tv ↗"
    },
    socialProof: {
      stat1Number: "3〜14",
      stat1Label: "キックオフから公開までの日数",
      stat2Number: "100%",
      stat2Label: "テンプレートを使わない完全オーダーメイド",
      stat3Number: "3",
      stat3Label: "追加費用のない、明確な3つの料金プラン",
      quote1Text: "「漠然としたアイデアを、数ヶ月ではなくわずか数日で形にしてくれました。ソフトウェアベンダーではなく、デザインスタジオと仕事をしているような感覚でした。」",
      quote1Attr: "創業者、独立系小売ブランド",
      quote2Text: "「プロセスは驚くほどシンプルでした。一度の打ち合わせと、静かに進む数日間を経て、本当に自分たちらしいサイトが出来上がりました。」",
      quote2Attr: "運営者、ホスピタリティ事業"
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
        cta: "ご相談ください"
      }
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
      a1: "納期はプランによって異なります。Launchサイトは通常3日以内に公開、Growサイトは1〜2週間以内に公開となります。Studioのビルドは案件ごとに幅が大きいため、個別にご相談のうえ決定します。",
      q2: "修正は何回までお願いできますか？",
      a2: "Launchプランには修正1回、Growプランには修正3回が含まれています。Studioはプロジェクトの内容に応じて個別に設定します。必要であれば、追加の修正回数をご用意することも可能です。",
      q3: "始めるにあたって、何を用意すればいいですか？",
      a3: "まずは短いヒアリングを行い、ご要望を伺うところから始めます。そのうえで、ロゴ、写真、ブランドカラー、既存のテキスト、可能であればドメインやホスティングアカウントへのアクセス情報などがあるとスムーズです。まだお持ちでない場合も、私たちがサポートしますのでご安心ください。",
      q4: "返金についてのポリシーを教えてください。",
      a4: "最初のデザイン案(初稿デザイン)をお渡しする前にキャンセルされた場合、作業はほとんど発生していないため、全額返金いたします。初稿デザインの提出後は、それまでのデザイン・開発にかかった時間を完了した業務とみなすため、以降キャンセルされた場合でも返金の対象外となります。"
    },
    whyNotTemplate: {
      heading: "テンプレートは、使わない",
      body: "テンプレートは、すでに他人の判断で組み立てられています。私たちはあなたの意思から出発し、借り物のテーマではなく、あなたのビジネスのためだけに設計されたサイトを、逆算しながら形にしていきます。"
    },
    footer: {
      tagline: "手仕事のような丁寧さを、驚くほどの速さで届けるウェブサイト。",
      copyright: "© 2026 Aura Sites. 無断複写・転載を禁じます。"
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
        placeholder: "例：Aura Sites"
      },
      description: {
        question: "ひとことで説明してください",
        placeholder: "例：こだわりのサワードウを扱う、街の小さなベーカリー"
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
        namePlaceholder: "お名前",
        emailPlaceholder: "メールアドレス",
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
        closeBtn: "閉じる"
      }
    }
  }
};
