import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/ai/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let lang = "ar";
        let userName = "صديقتنا المحاربة";

        try {
          const body = (await request.json()) as {
            messages?: {
              role: "user" | "model";
              content: string;
              attachment?: {
                type: "image";
                url: string;
                mimeType: string;
              };
            }[];
            lang?: string;
            userName?: string;
          };

          const rawMessages = body.messages || [];
          if (rawMessages.length === 0) {
            return Response.json({ error: "Messages array cannot be empty" }, { status: 400 });
          }

          lang = body.lang || "ar";
          userName = body.userName || "صديقتنا المحاربة";

          const apiKey = process.env.GEMINI_API_KEY?.trim();

          // Prepare system instruction
          const systemInstruction = `أنتِ "PinkCare AI – المساعد الذكي 💗" (PinkCare AI Assistant)، المساعد الرقمي الإنساني والمتخصص داخل تطبيق PinkCare الموجه لمحاربات ومتعافيات سرطان الثدي وذويهن في الجزائر والعالم العربي.

دورك ورسالتك:
1. تقديم التوعية الصحية الدقيقة والدعم النفسي والمعنوي الصادق بأسلوب دافئ ومطمئن.
2. الإجابة عن التساؤلات المتنوعة في المجالات: سرطان الثدي، الأعراض، الفحوصات والكشف المبكر، العلاجات (كيماوي، إشعاعي، جراحة، هرموني)، الآثار الجانبية، التغذية، التمارين والتأهيل الحركي، والاستعداد لمواعيد الأطباء.
3. التحدث باللغة التي تختارها المستخدمة:
   - لغة التطبيق الحالية: ${lang}.
   - إذا كانت لغة التطبيق "dz" (الدارجة الجزائرية) أو المستخدمة كتبت بالدارجة أو الأرابيزي (Arabizi مثل: wach rak, labas, rani...): أجيبي بدارجة جزائرية أصيلة ودافئة وحقيقية بمفردات جزائرية متداولة ومؤنثة (مثال: "مرحبا بيك", "يعطيك الصحة", "واش راكي حاسة", "لاباس عليك طمنينا على صحتك", "الدوايات تاعك", "الرونديفو الجاي عند الطبيب", "ماتتقلقيش رانا معاك خطوة بخطوة", "شربي كاس ما", "ريحي روحك"). تجنبي تماماً اللهجات المشرقية أو المغربية أو التونسية.
   - إذا سألت بالعربية الفصحى (ar): أجيبي بعربية فصحى راقية، سلسة، وواضحة.
   - إذا سألت بالفرنسية (fr): أجيبي بالفرنسية السليمة، المتعاطفة، والواضحة (Français chaleureux et médicalement précis).
   - لا تخلطي اللغات في الرد الواحد إلا إذا كان لشرح مصطلح طبي باللغة الأصلية (مثل Mammographie أو Biopsie).

المصادر والموثوقية العلمية:
- استندي دائماً إلى الحقائق الطبية المثبتة والمعتمدة من المنظمات الصحية الدولية:
  * منظمة الصحة العالمية (WHO)
  * المعهد الوطني للسرطان (NCI)
  * الجمعية الأمريكية للسرطان (ACS)
  * هيئة الخدمات الصحية الوطنية (NHS)
  * أبحاث Breast Cancer Now و PubMed
- عندما تشرحين مفهوماً طبياً أو إحصائية، اذكري اسم المصدر المعتمد بثقة.
- لا تختلقي دراسات وهمية أو روابط زائفة.

السلامة الطبية الإلزامية الصارمة (قواعد خط أحمر):
1. أنتِ لستِ طبيباً بشرياً، ومعلوماتكِ لأغراض التوعية والدعم النفسي فقط وليست تشخيصاً أو وصفة علاجية.
2. يُمنع منعاً باتاً:
   - تشخيص الحالة أو تحديد مرحلة الورم أو تأكيد المرض من خلال الأعراض.
   - وصف أدوية أو تعديل جرعات أو تقديم بدائل عشبية عن العلاجات الموصوفة.
   - اقتراح إيقاف العلاج الكيماوي أو الإشعاعي أو الجراحة.
   - إعطاء ضمانات مطلقة بالشفاء التام.
3. في حال ظهور أعراض طارئة أو خطيرة (مثل حمى تفوق 38° مئوية أثناء تلقي العلاج الكيميائي، صعوبة حادة في التنفس، ألم شديد ومفاجئ في الصدر أو الساق، نزيف مستمر)، وجهي المستخدمة فوراً إلى الطوارئ (14 للحماية المدنية بالجزائر / 15 SAMU / أقرب مستشفى).
4. في حال التعبير عن أزمة نفسية حادة أو أفكار إيذاء النفس، استجيبي بأقصى درجات العاطفة الإيجابية وحثيها على طلب مساعدة فورية من الأهل وخطوط المساعدة النفسية ومختص الرعاية.

التكامل مع أقسام تطبيق PinkCare:
- قسم التمارين والتأهيل الحركي والمجسم 3D: يمكنكِ توجيه المستخدمة لفتح قسم التمارين في التطبيق لمشاهدة حركات استعادة مرونة الكتف وتدليك تفادي الوذمة اللمفاوية (بموافقة طبيبها المعالج).
- قسم الاستشارات الطبية (Teleconsult): يمكنكِ اقتراح حجز استشارة عن بُعد مع أحد الأطباء المعتمدين في PinkCare.
- مجتمع PinkCare: يمكنكِ تشجيعها على مشاركة مشاعرها في مجموعات الدعم الجماعية لتبادل الأمل.
- قسم العناية اليومية (Care): تذكيرها بجدول شرب الماء وتناول الأدوية.

التنسيق:
- استخدمي تنسيقاً منظماً (عناوين فرعية، نقاط واضحة، مسافات مريحة للقراءة).
- اسم المستخدمة الحالية للتفاعل الإنساني: ${userName}.`;

          const fallbackEducationalReply =
            lang === "en"
              ? `Dear ${userName} 🌸\n\nYour question is very important: gentle movement, listening to your body, and consistent care are essential for your recovery. They help prevent stiffness, improve lymphatic drainage to minimize lymphedema, and safely restore your natural range of motion.\n\n💡 *Helpful Note:* To enable direct, personalized responses via Google Gemini, you can set the free GEMINI_API_KEY in your hosting environment variables (no Google Cloud Billing required). Meanwhile, all core PinkCare features (3D interactive rehabilitation, teleconsultations, and community support) are 100% available!`
              : lang === "fr"
                ? `Chère ${userName} 🌸\n\nVotre question est essentielle : les mouvements doux, l'écoute de votre corps et l'accompagnement régulier sont cruciaux pour votre rétablissement. Ils aident à prévenir les raideurs, améliorer la circulation lymphatique et restaurer votre bien-être au quotidien.\n\n💡 *Rappel bienveillant :* Pour activer la génération en direct de réponses personnalisées via Google Gemini, vous pouvez attacher une clé API valide dans les paramètres du serveur (Settings > Secrets). En attendant, toutes les fonctionnalités de PinkCare (exercices 3D, consultations médicales et soutien communautaire) restent 100% à votre disposition !`
                : lang === "dz"
                  ? `مرحبا بيك يا ${userName} 💗\n\nالسؤال تاعك مهم بزاف: الحركات الخفيفة والتأهيل الحركي يعاونوك بزاف باش تتفاداي التيبس وتورم اليد والكتف (Lymphedema)، وتسترجعي صحتك خطوة بخطوة بلا تعب.\n\n💡 *ملاحظة داعمة :* باش يخدم الذكاء الاصطناعي التوليدي مباشرة، حطي مفتاح GEMINI_API_KEY في إعدادات السيرفر (Settings > Secrets). وفي هاد الوقت، قاع خدمات PinkCare (التمارين التفاعلية 3D، استشارات الأطباء، ومجموعة الدعم) راهم واجدين وفي خدمتك بكل حب 🌸!`
                  : `أهلاً بكِ يا ${userName} 💗\n\nسؤالكِ قيّم ومهم جداً: تساعد تمارين التأهيل اللطيفة وحركات تمديد الكتف والذراع على منع تيبس المفاصل، وتحفيز التصريف اللمفاوي لتجنب الوذمة اللمفاوية (Lymphedema)، واستعادة المدى الحركي الطبيعي بالتدريج وبأمان.\n\n💡 *إرشاد داعم :* لتشغيل المحادثة اللحظية المباشرة مع نموذج Gemini السحابي، تأكدي من إرفاق مفتاح GEMINI_API_KEY في إعدادات السيرفر (Settings > Secrets). وفي هذه الأثناء، يمكنكِ الاستفادة من قسم التمارين التفاعلي ثلاثي الأبعاد ومجتمع الدعم داخل التطبيق !`;

          const defaultSources = [
            {
              title: "منظمة الصحة العالمية (WHO) – إرشادات رعاية سرطان الثدي",
              uri: "https://www.who.int/news-room/fact-sheets/detail/breast-cancer",
            },
            {
              title: "الجمعية الأمريكية للسرطان (ACS) – التأهيل الحركي والتمارين",
              uri: "https://www.cancer.org/cancer/types/breast-cancer.html",
            },
          ];

          // If no API key or placeholder key, immediately provide the educational response without triggering 400 error
          const isValidKeyFormat =
            apiKey && apiKey.length > 20 && !apiKey.includes("YOUR_") && apiKey.startsWith("AIza");

          if (!isValidKeyFormat) {
            return Response.json({
              reply: fallbackEducationalReply,
              sources: defaultSources,
              isFallback: true,
            });
          }

          // Initialize GoogleGenAI SDK strictly following skill guidelines
          try {
            const { GoogleGenAI } = await import("@google/genai");
            const ai = new GoogleGenAI({
              apiKey,
              httpOptions: {
                headers: {
                  "User-Agent": "aistudio-build",
                },
              },
            });

            // Prepare multi-turn contents for Gemini
            const contents = rawMessages.map((m) => {
              const parts: Array<{
                text?: string;
                inlineData?: { mimeType: string; data: string };
              }> = [];

              if (m.attachment && m.attachment.url) {
                const base64Data = m.attachment.url.includes(",")
                  ? m.attachment.url.split(",")[1]
                  : m.attachment.url;
                parts.push({
                  inlineData: {
                    mimeType: m.attachment.mimeType || "image/jpeg",
                    data: base64Data,
                  },
                });
              }

              parts.push({
                text: m.content || "",
              });

              return {
                role: m.role === "user" ? "user" : "model",
                parts,
              };
            });

            const response = await ai.models.generateContent({
              model: "gemini-3.8-flash",
              contents,
              config: {
                systemInstruction,
              },
            });

            const replyText = response.text || "";

            const sources: { title: string; uri?: string }[] = [];
            const candidate = response.candidates?.[0];
            const searchChunks = candidate?.groundingMetadata?.groundingChunks || [];

            for (const chunk of searchChunks) {
              if (chunk.web?.title && chunk.web?.uri) {
                sources.push({
                  title: chunk.web.title,
                  uri: chunk.web.uri,
                });
              }
            }

            if (sources.length === 0) {
              sources.push(...defaultSources);
            }

            return Response.json({
              reply: replyText,
              sources: sources.slice(0, 3),
              timestamp: new Date().toISOString(),
            });
          } catch (callError) {
            console.warn("Gemini call fell back to safe educational response:", callError);
            return Response.json({
              reply: fallbackEducationalReply,
              sources: defaultSources,
              isFallback: true,
            });
          }
        } catch (error) {
          console.error("PinkCare AI Server Error:", error);
          return Response.json(
            {
              reply:
                lang === "fr"
                  ? "Une interruption temporaire est survenue. Veuillez réessayer 🌸"
                  : "عذراً يا عزيزتي، حدث اضطراب مؤقت في الاتصال بخدمة الذكاء الاصطناعي. يُرجى النقر على زر 'إعادة المحاولة' للمتابعة، ونحن دائماً بجانبكِ 🌸",
              sources: [
                {
                  title: "منظمة الصحة العالمية (WHO)",
                  uri: "https://www.who.int/news-room/fact-sheets/detail/breast-cancer",
                },
              ],
            },
            { status: 200 },
          );
        }
      },
    },
  },
});
