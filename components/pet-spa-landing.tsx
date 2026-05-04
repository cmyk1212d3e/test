"use client";

import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";

type Slide = {
  src: string;
  label: string;
};

const heroSlides: Slide[] = [
  { src: "/assets/store-reception.png", label: "前厅接待区" },
  { src: "/assets/store-spa.png", label: "专业洗护水疗区" },
  { src: "/assets/store-grooming.png", label: "吹干造型区" }
];

const services = [
  {
    title: "基础洁净洗护",
    copy: "温水清洁、低噪吹干、耳道清洁、指甲修剪、脚底毛修整和基础梳理，适合日常维持干净清爽。",
    tag: "日常高频",
    price: "¥98 起",
    src: "/assets/service-basic-bath.png",
    alt: "小型犬在宠物洗护店接受温和基础洗澡"
  },
  {
    title: "深层护毛 SPA",
    copy: "针对毛量厚、换毛期或毛发干涩的宠物，增加开结梳理、护毛乳停留和顺毛吹整。",
    tag: "毛量友好",
    price: "¥168 起",
    src: "/assets/service-coat-spa.png",
    alt: "金毛犬在宠物 SPA 房进行深层护毛护理"
  },
  {
    title: "精修美容造型",
    copy: "脸部轮廓、身体线条、四肢圆柱、尾部造型与局部细节修剪，完成后可拍一张到店状态照。",
    tag: "换季焕新",
    price: "¥238 起",
    src: "/assets/service-styling-trim.png",
    alt: "贵宾犬在美容台上进行精修造型"
  },
  {
    title: "猫咪安抚护理",
    copy: "独立安静时段，包含轻柔梳理、浮毛处理、指甲修剪、局部清洁，按猫咪状态分段完成。",
    tag: "提前预约",
    price: "¥198 起",
    src: "/assets/service-cat-care.png",
    alt: "长毛猫在安静房间进行梳毛护理"
  },
  {
    title: "敏感肌舒缓洗",
    copy: "使用低刺激配方，避开浓香和强清洁产品，洗前确认皮肤状态，洗后反馈红疹、皮屑与抓挠情况。",
    tag: "皮肤关注",
    price: "¥158 起",
    src: "/assets/store-spa.png",
    alt: "宠物洗护水疗区的温和护理环境"
  },
  {
    title: "大型犬减压洗护",
    copy: "预留更长洗护台位与吹干时间，分区吹干、短时休息，降低大型犬久站和噪音带来的压力。",
    tag: "大狗专属",
    price: "¥288 起",
    src: "/assets/store-grooming.png",
    alt: "宠物洗护店的大型犬吹干造型区"
  }
];

const prices = [
  {
    title: "小型犬日常洗护",
    price: "¥98",
    note: "约 60-80 分钟",
    featured: false,
    items: ["温和沐浴与吹干", "耳道清洁", "指甲修剪", "脚底毛修整"]
  },
  {
    title: "中型犬全身精护",
    price: "¥168",
    note: "约 90-120 分钟",
    featured: true,
    items: ["基础洗护全套", "深层梳理与开结", "护毛乳护理", "护理状态反馈"]
  },
  {
    title: "造型美容套餐",
    price: "¥238",
    note: "按体型与毛量微调",
    featured: false,
    items: ["全身洗护", "专属造型修剪", "毛发柔顺护理", "到店状态照"]
  },
  {
    title: "猫咪安抚护理",
    price: "¥198",
    note: "需提前确认性格",
    featured: false,
    items: ["浮毛梳理", "指甲修剪", "局部清洁", "分段安抚休息"]
  }
];

const addOns = [
  { name: "局部开结", price: "¥30-80" },
  { name: "药浴/舒缓洗", price: "¥60 起" },
  { name: "牙齿清洁", price: "¥39" },
  { name: "肉垫护理", price: "¥29" },
  { name: "肛门腺护理", price: "¥20" },
  { name: "大型犬加时", price: "¥80 起" }
];

const gallery = [
  {
    src: "/assets/service-basic-bath.png",
    alt: "温和犬只基础洗护服务",
    title: "洁净洗护",
    copy: "从耳朵、指甲到脚底细节都做完整。"
  },
  {
    src: "/assets/service-styling-trim.png",
    alt: "宠物美容造型修剪服务",
    title: "精修造型",
    copy: "按毛量和脸型调整线条，不只剪短。"
  },
  {
    src: "/assets/service-cat-care.png",
    alt: "猫咪低压力梳毛护理服务",
    title: "猫咪护理",
    copy: "安静时段、分段处理，把压力降下来。"
  }
];

export function PetSpaLanding() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [timerVersion, setTimerVersion] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const slideTimer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 4200);

    return () => window.clearInterval(slideTimer);
  }, [timerVersion]);

  function setDefaultArrival() {
    const dateInput = formRef.current?.elements.namedItem("date") as HTMLInputElement | null;
    const timeInput = formRef.current?.elements.namedItem("time") as HTMLInputElement | null;

    if (!dateInput || !timeInput) {
      return;
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const month = `${tomorrow.getMonth() + 1}`.padStart(2, "0");
    const day = `${tomorrow.getDate()}`.padStart(2, "0");

    dateInput.value = `${tomorrow.getFullYear()}-${month}-${day}`;
    timeInput.value = "09:30";
  }

  useEffect(() => {
    setDefaultArrival();
  }, []);

  function showSlide(index: number) {
    setActiveSlide((index + heroSlides.length) % heroSlides.length);
    setTimerVersion((current) => current + 1);
  }

  function choosePlan(plan: string) {
    setSelectedPlan(plan);
    setStatus("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const booking = {
      owner: String(formData.get("owner") || ""),
      phone: String(formData.get("phone") || ""),
      pet: String(formData.get("pet") || ""),
      plan: String(formData.get("plan") || ""),
      date: String(formData.get("date") || ""),
      time: String(formData.get("time") || ""),
      note: String(formData.get("note") || "")
    };

    setIsSubmitting(true);
    setStatus("正在提交预约...");

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(booking)
      });

      const result = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "预约提交失败，请稍后再试。");
      }

      setStatus(`${booking.owner || "主人"}，${booking.plan || "洗护"}预约已记录，稍后会电话确认。`);
      form.reset();
      setDefaultArrival();
      setSelectedPlan("");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "预约提交失败，请稍后再试。");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <header className="topbar">
        <nav className="nav" aria-label="主导航">
          <a className="brand" href="#top">
            <span className="brand-mark" aria-hidden="true">
              <PawIcon />
            </span>
            <span>泡泡爪 Pet Spa</span>
          </a>
          <div className="nav-links">
            <a href="#services">洗护项目</a>
            <a href="#care">护理标准</a>
            <a href="#pricing">价位表</a>
            <a href="#booking">预约到店</a>
          </div>
          <a className="nav-cta" href="#booking">
            立即预约
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="hero" aria-label="泡泡爪宠物洗护店">
          <div className="hero-carousel" aria-hidden="true">
            {heroSlides.map((slide, index) => (
              <div
                className={`hero-slide ${index === activeSlide ? "is-active" : ""}`}
                key={slide.src}
              >
                <Image
                  src={slide.src}
                  alt=""
                  fill
                  priority={index === 0}
                  sizes="100vw"
                />
              </div>
            ))}
          </div>
          <div className="hero-inner">
            <div>
              <p className="eyebrow">社区宠物洗护 · 美容 · 护理</p>
              <h1>泡泡爪 Pet Spa</h1>
              <p className="hero-copy">
                给爱宠一场清爽、安心、低压力的洗护体验。独立洗护间、温和护理产品、透明价位表，让每一次到店都更省心。
              </p>
              <div className="hero-actions">
                <a className="button" href="#booking">
                  预约洗护
                </a>
                <a className="button secondary" href="#pricing">
                  查看价位
                </a>
              </div>
            </div>
            <aside className="hero-note">
              <strong>今日可约</strong>
              <span>小型犬基础洗护约 60 分钟，猫咪护理需提前确认性格与当日状态。</span>
            </aside>
          </div>
          <div className="hero-dots" aria-label="店内环境轮播图">
            {heroSlides.map((slide, index) => (
              <button
                aria-label={slide.label}
                aria-pressed={index === activeSlide}
                className={`hero-dot ${index === activeSlide ? "is-active" : ""}`}
                key={slide.label}
                onClick={() => showSlide(index)}
                type="button"
              />
            ))}
          </div>
        </section>

        <section id="services">
          <div className="section-inner">
            <div className="section-head">
              <div>
                <p className="kicker">Services</p>
                <h2>洗护项目更细分，按体型、毛量和状态安排流程</h2>
              </div>
              <p>服务前先做皮毛状态检查，再根据体型、毛量、皮肤敏感度和当天情绪调整洗护方式。</p>
            </div>

            <div className="services">
              {services.map((service) => (
                <article className="service-card" key={service.title}>
                  <div className="service-image relative">
                    <Image
                      src={service.src}
                      alt={service.alt}
                      fill
                      sizes="(max-width: 880px) 100vw, 33vw"
                    />
                  </div>
                  <div className="service-body">
                    <h3>{service.title}</h3>
                    <p>{service.copy}</p>
                    <div className="meta">
                      <span>{service.tag}</span>
                      <strong>{service.price}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="split" id="care">
          <div className="section-inner split-grid">
            <div className="portrait-stack" aria-hidden="true">
              <div className="portrait relative">
                <Image
                  src="/assets/service-styling-trim.png"
                  alt=""
                  fill
                  sizes="(max-width: 880px) 50vw, 35vw"
                />
              </div>
              <div className="portrait small relative">
                <Image
                  src="/assets/service-coat-spa.png"
                  alt=""
                  fill
                  sizes="(max-width: 880px) 50vw, 25vw"
                />
              </div>
              <div className="portrait small relative">
                <Image
                  src="/assets/service-cat-care.png"
                  alt=""
                  fill
                  sizes="(max-width: 880px) 100vw, 25vw"
                />
              </div>
            </div>

            <div>
              <p className="kicker">Care Standard</p>
              <h2>把干净做细，也把情绪照顾好</h2>
              <div className="care-list">
                <article className="care-item">
                  <span className="icon" aria-hidden="true">
                    <BottleIcon />
                  </span>
                  <div>
                    <h3>温和产品</h3>
                    <p>选用低刺激洗护用品，敏感皮肤会避开浓香和强清洁配方。</p>
                  </div>
                </article>

                <article className="care-item">
                  <span className="icon" aria-hidden="true">
                    <DryerIcon />
                  </span>
                  <div>
                    <h3>低噪护理</h3>
                    <p>分段吹干和短时休息，尽量降低吹水机、烘箱和陌生环境带来的压力。</p>
                  </div>
                </article>

                <article className="care-item">
                  <span className="icon" aria-hidden="true">
                    <ShieldIcon />
                  </span>
                  <div>
                    <h3>透明记录</h3>
                    <p>护理后反馈皮肤、耳朵、指甲和毛结情况，方便下一次养护安排。</p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing">
          <div className="section-inner">
            <div className="section-head">
              <div>
                <p className="kicker">Pricing</p>
                <h2>常用价位表清晰标价，到店按实际毛量微调</h2>
              </div>
              <p>到店前可先发送爱宠照片，工作人员会预估时长和价格范围，严重打结、特殊护理会提前确认。</p>
            </div>

            <div className="pricing">
              {prices.map((price) => (
                <article
                  className={`price-card ${price.featured ? "featured" : ""}`}
                  key={price.title}
                >
                  {price.featured ? <span className="badge">热门</span> : null}
                  <h3>{price.title}</h3>
                  <div className="price">
                    {price.price} <span>起</span>
                  </div>
                  <p className="price-note">{price.note}</p>
                  <ul>
                    {price.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <a
                    className="button"
                    data-plan={price.title}
                    href="#booking"
                    onClick={() => choosePlan(price.title)}
                  >
                    选择套餐
                  </a>
                </article>
              ))}
            </div>

            <div className="add-on-panel">
              <div>
                <p className="kicker">Add-ons</p>
                <h3>加项价位</h3>
              </div>
              <div className="add-ons">
                {addOns.map((item) => (
                  <div className="add-on" key={item.name}>
                    <span>{item.name}</span>
                    <strong>{item.price}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="gallery-band" aria-label="店内护理片段">
          <div className="gallery">
            {gallery.map((item) => (
              <figure className="gallery-item relative" key={item.title}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 880px) 100vw, 33vw"
                />
                <figcaption className="gallery-caption">
                  <strong>{item.title}</strong>
                  <span>{item.copy}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="booking" id="booking">
          <div className="section-inner booking-grid">
            <aside className="hours">
              <p className="kicker">Booking</p>
              <h2>预约到店</h2>
              <p>建议提前一天预约。大型犬、长毛猫、严重打结或皮肤异常情况，请先电话沟通。</p>
              <dl>
                <div>
                  <dt>营业时间</dt>
                  <dd>10:00 - 20:00</dd>
                </div>
                <div>
                  <dt>门店地址</dt>
                  <dd>上海市宜川路街道陕西北路1620号</dd>
                </div>
                <div>
                  <dt>预约电话</dt>
                  <dd>138 0000 2468</dd>
                </div>
                <div>
                  <dt>微信咨询</dt>
                  <dd>lulunevergvup</dd>
                </div>
              </dl>
            </aside>

            <figure className="store-map" aria-label="泡泡爪 Pet Spa 门店位置示意图">
              <Image
                src="/assets/store-map-ai.png"
                alt="可爱清新宠物店风格地图，标出门店位于上海市宜川路街道陕西北路1620号"
                width={900}
                height={900}
                sizes="(max-width: 1040px) 50vw, 30vw"
              />
              <figcaption className="map-caption">
                上海市宜川路街道陕西北路1620号，靠近陕西北路与南昌路路口。
              </figcaption>
            </figure>

            <form className="form" id="bookingForm" onSubmit={handleSubmit} ref={formRef}>
              <div className="field-grid">
                <label>
                  主人姓名
                  <input name="owner" type="text" placeholder="例如：李小姐" required />
                </label>
                <label>
                  联系电话
                  <input name="phone" type="tel" placeholder="请输入手机号" required />
                </label>
              </div>

              <div className="field-grid">
                <label>
                  宠物类型
                  <select name="pet" required defaultValue="">
                    <option value="">请选择</option>
                    <option>小型犬</option>
                    <option>中型犬</option>
                    <option>大型犬</option>
                    <option>猫咪</option>
                  </select>
                </label>
                <label>
                  意向套餐
                  <select
                    name="plan"
                    id="planSelect"
                    onChange={(event) => setSelectedPlan(event.target.value)}
                    required
                    value={selectedPlan}
                  >
                    <option value="">请选择</option>
                    {prices.map((price) => (
                      <option key={price.title}>{price.title}</option>
                    ))}
                    <option>先咨询</option>
                  </select>
                </label>
              </div>

              <div className="field-grid">
                <label>
                  到店日期
                  <input name="date" type="date" required />
                </label>
                <label>
                  期望时段
                  <input name="time" type="time" required step={1800} />
                </label>
              </div>

              <label>
                备注
                <textarea name="note" placeholder="例如：怕吹风、皮肤敏感、毛结较多" />
              </label>

              <div className="form-foot">
                <button className="button" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "提交中..." : "提交预约"}
                </button>
                <span className="form-status" id="formStatus" role="status" aria-live="polite">
                  {status}
                </span>
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-inner">
          <span>泡泡爪 Pet Spa · 宠物洗护与美容</span>
          <span>干净、温柔、准时，让爱宠漂漂亮亮回家。</span>
        </div>
      </footer>
    </>
  );
}

function PawIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path
        d="M8.5 10.3c1.5 0 2.6 1.1 2.6 2.5 0 1.5-1.1 2.5-2.6 2.5S6 14.3 6 12.8c0-1.4 1-2.5 2.5-2.5Z"
        fill="currentColor"
      />
      <path
        d="M15.5 10.3c1.5 0 2.5 1.1 2.5 2.5 0 1.5-1 2.5-2.5 2.5s-2.6-1-2.6-2.5c0-1.4 1.1-2.5 2.6-2.5Z"
        fill="currentColor"
      />
      <path
        d="M12 13.3c2.8 0 5.1 1.9 5.1 4.2 0 1.4-1.1 2.4-2.5 2-1.6-.4-3.6-.4-5.2 0-1.4.4-2.5-.6-2.5-2 0-2.3 2.3-4.2 5.1-4.2Z"
        fill="currentColor"
      />
      <path
        d="M7.4 5.2c1.1-.2 2.1.8 2.3 2.1.2 1.4-.4 2.6-1.5 2.8-1.1.2-2.1-.8-2.3-2.1-.2-1.4.4-2.6 1.5-2.8Z"
        fill="currentColor"
      />
      <path
        d="M16.6 5.2c1.1.2 1.7 1.4 1.5 2.8-.2 1.3-1.2 2.3-2.3 2.1-1.1-.2-1.7-1.4-1.5-2.8.2-1.3 1.2-2.3 2.3-2.1Z"
        fill="currentColor"
      />
    </svg>
  );
}

function BottleIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M8 3h8" />
      <path d="M9 3v5l-4 7a4 4 0 0 0 3.5 6h7a4 4 0 0 0 3.5-6l-4-7V3" />
      <path d="M8 15h8" />
    </svg>
  );
}

function DryerIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M4 13a8 8 0 0 1 16 0" />
      <path d="M6 13v4a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-4" />
      <path d="M9 9h.01" />
      <path d="M15 9h.01" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M12 3l7 4v5c0 4.5-2.9 7.8-7 9-4.1-1.2-7-4.5-7-9V7l7-4Z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
