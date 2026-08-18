(function () {
  "use strict";

  /**
   * מבנה הנתונים עבור חלונות המודאל של הצ׳ק־ליסט (checklistDetails):
   * 
   * כל כרטיסייה יכולה לכלול את השדות הבאים (כולם אופציונליים למעט title):
   * - title: כותרת החלון.
   * - action: תיאור הפעולה ("מה עושים?").
   * - actionTitle: כותרת מותאמת אישית לחלק הפעולה (ברירת מחדל: "מה עושים?").
   * - contact: פירוט איש/אשת קשר או מוקד ("למי פונים?").
   * - contactTitle: כותרת מותאמת אישית לחלק הקשר (ברירת מחדל: "למי פונים?").
   * - bulletsTitle: כותרת רשימת הבולטים (ברירת מחדל: "קישורים ומידע שימושי:").
   * - bullets: מערך של פריטים לרשימה. כל פריט יכול להיות:
   *     1. מחרוזת פשוטה: "טקסט רגיל כבולט"
   *     2. קישור לאתר: { label: "אתר", text: "פורטל המרצים", url: "https://..." }
   *     3. קישור למסמך: { label: "מסמך", text: "מדריך למרצה (PDF)", file: "assets/docs/guide.pdf" }
   *     4. חיוג טלפוני: { label: "טלפון", text: "03-5026666", phone: "03-5026666", contactName: "מוקד מחשוב" }
   *     5. שליחת דוא״ל: { label: "דוא״ל", text: "helpdesk@hit.ac.il", email: "helpdesk@hit.ac.il" }
   *     6. בולט עם תווית/הערה: { label: "שימו לב", text: "תוכן ההערה", note: "הסבר נוסף" }
   * - missing: הערת placeholder להשלמה לפני השקה (מוצגת רק אם קיים ערך).
   */
  window.NEW_LECTURERS_CONTENT = {
    checklistDetails: {
      "tech-login": {
        title: "שמירת פרטי ההתחברות והגדרת אימות דו־שלבי",
        action: "שמרו במקום מאובטח ונגיש את פרטי ההתחברות למערכות המכון, והתקינו בנייד את אפליקציית האימות הדו־שלבי.",
        contact: "מוקד המחשוב.",
        bulletsTitle: "מדריך ותמיכה טכנית:",
        bullets: [
          {
            label: "מדריך",
            text: "מדריך להתקנת אפליקצית האימות",
            url: "https://www.hit.ac.il/wp-content/uploads/2026/07/netiq-authenticator-2FA.pdf"
          },
          {
            label: "טלפון מוקד",
            text: "03-5026541",
            phone: "03-5026541"
          }
        ]
      },
      "tech-moodle": {
        title: "כניסה לסביבת הלמידה ב־Moodle",
        action: "היכנסו לאתר הקורס ובדקו שיש לכם הרשאת עריכה ושהקורס הנכון מופיע אצלכם.",
        contact: "מוטי רוסו",
        bulletsTitle: "קישורים שימושיים:",
        bullets: [
          {
            label: "אתר",
            text: "כניסה לסביבת Moodle HIT",
            url: "https://portal.hit.ac.il/"
          },
          {
            label: "מדריך",
            text: "מדריך כניסה ראשונית",
            url: "https://www.hit.ac.il/computer-center/e-learning/"
          },
          {
            label: "טופס פנייה דיגיטלי",
            text: "טופס פנייה דיגיטלי",
            url: "https://www.hit.ac.il/moodle-support/"
          },
          {
            label: "טלפון",
            text: "03-5026566",
            phone: "03-5026566"
          },
          {
            label: "דואר אלקטרוני",
            text: "motir@hit.ac.il",
            email: "motir@hit.ac.il"
          }
        ],
      },
      "tech-zoom": {
        title: "היכרות עם Zoom באתר הקורס",
        action: "התחברו ל־Zoom, פתחו פגישת ניסיון ובדקו את רכיב Zoom באתר הקורס.",
        contact: "מוטי רוסו",
        bulletsTitle: "עזרים ומדריכים:",
        bullets: [
          {
            label: "מדריך",
            text: "סרטון הדרכה - הפעלת רכיב Zoom ב-Moodle",
            url: "https://www.youtube.com/watch?v=I0POE0D92NQ"
          }, {
            label: "מדריך",
            text: "מדריך- הפעלת רכיב Zoom ב-Moodle",
            url: "https://drive.google.com/file/d/1rahkr23ijP8PPG3bwLqrktfZb-y_tySB/view"
          },
          {
            label: "טלפון",
            text: "03-5026566",
            phone: "03-5026566"
          },
          {
            label: "דואר אלקטרוני",
            text: "motir@hit.ac.il",
            email: "motir@hit.ac.il"
          },
          {
            label: "טיפים לשיפור הנראות בזום",
            text: "טיפים לשיפור הנראות בזום",
            url: "https://md.hit.ac.il/mod/page/view.php?id=838020"
          }
        ],
      },
      "tech-recording": {
        title: "ניסוי בהקלטת שיעור",
        action: "בצעו הקלטת ניסיון קצרה, עצרו אותה, ואתרו היכן היא נשמרת וכיצד משתפים אותה עם סטודנטים.",
        contact: "מוטי רוסו",
        bulletsTitle: "עזרים ומדריכים:",
        bullets: [
          {
            label: "מדריך",
            text: "סרטון הדרכה - הפעלת רכיב Zoom ב-Moodle",
            url: "https://www.youtube.com/watch?v=I0POE0D92NQ"
          }, {
            label: "מדריך",
            text: "מדריך- הפעלת רכיב Zoom ב-Moodle",
            url: "https://drive.google.com/file/d/1rahkr23ijP8PPG3bwLqrktfZb-y_tySB/view"
          },
          {
            label: "טלפון",
            text: "03-5026566",
            phone: "03-5026566"
          },
          {
            label: "דואר אלקטרוני",
            text: "motir@hit.ac.il",
            email: "motir@hit.ac.il"
          },
          {
            label: "טיפים לשיפור הנראות בזום",
            text: "טיפים לשיפור הנראות בזום",
            url: "https://md.hit.ac.il/mod/page/view.php?id=838020"
          }
        ],
      },
      "tech-calendar": {
        title: "בדיקת לוח השנה האקדמי",
        action: "בדקו כמה מפגשים מתקיימים בפועל בסמסטר וסמנו חופשות, טקסים ואירועים שעשויים להשפיע על רצף ההוראה.",
        contact: "מזכירות המחלקה ומנהל אקדמי",
        bulletsTitle: "קישורים:",
        bullets: [
          {
            label: "אתר",
            text: "לוח שנה אקדמי",
            url: "https://www.hit.ac.il/students/calender/"
          }
        ],
      },
      "tech-email": {
        title: "העברת דוא״ל מהתיבה המוסדית",
        action: "אם אינכם בודקים את התיבה המוסדית באופן קבוע, הגדירו העברה אוטומטית של המיילים לתיבה הראשית שלכם. חשוב לבצע זאת מכייון שמערכות המכון והסטודנטים יפנו למייל המוסדי שלכם.",
        contact: "מוקד המחשוב.",
        bulletsTitle: "תמיכה טכנית:",
        bullets: [
          {
            label: "טלפון מוקד",
            text: "03-5026541",
            phone: "03-5026541"
          }
        ],
      },
      "tech-hybrid": {
        title: "הדרכה על כיתה היברידית",
        action: "אם הקורס מתקיים בפורמט היברידי, תאמו מראש הדרכה טכנית בכיתה שבה תלמדו.",
        contact: "להדרכה וסיוע טכני יש לפנות למוקד מחשוב, לייעוץ פדגוגי על הוראה היברידית יש לפנות למרכז לקידום ההוראה.",
        bulletsTitle: "לתיאום ומידע:",
        bullets: [
          {
            label: "מוקד מחשוב",
            text: "03-5026541",
            phone: "03-5026541"
          },
          {
            label: "מרכז לקידום ההוראה",
            text: "טופס פנייה למרכז לקידום ההוראה",
            url: "https://www.hit.ac.il/staff/teaching-center/#contact"
          },
          {
            label: "סרטון הדרכה",
            text: "הדרכה מקוצרת על כיתה היברידת",
            url: "https://www.hit.ac.il/computer-center/tutorial-videos/"
          }
        ],
      },
      "class-moodle-content": {
        title: "העלאת תכני הקורס ל־Moodle",
        action: "העלו את חומרי הקורס לאתר (לדוגמה: סילבוס, מצגת פתיחה, פרטי קשר וחומרי עזר). מומלץ לסדר את התכנים לפי נושאים או שבועות.",
        contact: "מוטי רוסו",
        bulletsTitle: "חומרים ותמיכה:",
        bullets: [
          {
            label: "טופס פנייה דיגיטלי",
            text: "טופס פנייה דיגיטלי",
            url: "https://www.hit.ac.il/moodle-support/"
          },
          {
            label: "טלפון",
            text: "03-5026566",
            phone: "03-5026566"
          },
          {
            label: "דואר אלקטרוני",
            text: "motir@hit.ac.il",
            email: "motir@hit.ac.il"
          },
          {
            label: "מדריך",
            text: "איך לעצב סביבת למידה מקדמת למידה",
            url: "https://md.hit.ac.il/mod/page/view.php?id=838007"
          },
          {
            label: "מדריך",
            text: "עיצוב סביבת למידה מרובת מרצים וקבוצות",
            url: "https://md.hit.ac.il/mod/book/view.php?id=838029"
          }
        ],
      },
      "class-room": {
        title: "בדיקת הכיתה והציוד",
        action: "אתרו את הכיתה והתנסו בהתחברות למחשב. אם לא ניתן להגיע מראש, מומלץ להגיע 45 דקות לפני השיעור הראשון.",
        contact: "לאיתור הכיתה יש לפנות למזכירות המחלקה, לתקלות יש לפנות למוקד מחשוב או למוקד האור-קולי",
        bulletsTitle: "לסיוע ותמיכה:",
        bullets: [
          {
            label: "מוקד מחשוב",
            text: "03-5026541",
            phone: "03-5026541"
          },
          {
            label: "מוקד אור-קולי",
            text: "03-5026606",
            phone: "03-5026606"
          }
        ],
      },
      "class-software": {
        title: "בקשה להתקנת תוכנות",
        action: "שלחו בקשה מוקדם ככל האפשר להתקנת כל תוכנה ייעודית הנדרשת לשיעור על מחשב המרצה בכיתה ועל מחשבי הסטודנטים במעבדות המחשבים.",
        contact: "מיכל חלפון",
        bulletsTitle: "להגשת בקשה:",
        bullets: [
          {
            label: "דוא״ל",
            text: "michalhal@hit.ac.il",
            email: "michalhal@hit.ac.il"
          }
        ],
      },
      "class-contacts": {
        title: "שמירת אנשי קשר חשובים",
        action: "שמרו בנייד את מזכירות המחלקה, מוקד המחשוב, מוקד המשק והמוקד האור־קולי, כדי שיהיו זמינים גם בזמן שיעור.",
        bulletsTitle: "אנשי הקשר:",
        bullets: [
          {
            label: "מוקד מחשוב",
            text: "03-5026541",
            phone: "03-5026541"
          },
          {
            label: "מוקד אור-קולי",
            text: "03-5026606",
            phone: "03-5026606"
          },
          {
            label: "מוקד משק (לוגיסטיקה, חשמל, מזגנים) תורנות בוקר",
            text: "03-5026710",
            phone: "03-5026710"
          },
          {
            label: "מוקד משק (לוגיסטיקה, חשמל, מזגנים) תורנות אחרהצ",
            text: "054-5825157",
            phone: "054-5825157"
          }
        ],
      },
      "first-expectations": {
        title: "תכנון תיאום הציפיות",
        action: "הגדירו מראש דרכי תקשורת, השתתפות, הגשות, שימוש ב־AI וכללים חשובים נוספים שתרצו להציג במפגש הראשון.",
        contact: "המרכז לקידום ההוראה.",
        bulletsTitle: "תבניות ותמיכה:",
        bullets: [
          {
            label: "תבנית",
            text: "מיישרים קו: תבנית לתיאום ציפיות בשיעור הראשון",
            url: "https://md.hit.ac.il/mod/page/view.php?id=954236"
          }, {
            label: "מרכז לקידום ההוראה",
            text: "טופס פנייה למרכז לקידום ההוראה",
            url: "https://www.hit.ac.il/staff/teaching-center/#contact"
          }
        ],
      },
      "first-message": {
        title: "פרסום הודעת פתיחה ב־Moodle",
        action: "פרסמו הודעה בלוח ההודעות שבאתר הקורס לפני השיעור הראשון ובה היכרות קצרה, פרטי קשר, הנחיות להתקנת תוכנות או ציוד נדרש, מועד ומיקום השיעור.",
        contact: "במקרה של אתגר בשליחת ההודעה ניתן לפנות למוטי רוסו",
        bulletsTitle: "לתמיכה:",
        bullets: [
          {
            label: "טלפון",
            text: "03-5026566",
            phone: "03-5026566"
          },
          {
            label: "דואר אלקטרוני",
            text: "motir@hit.ac.il",
            email: "motir@hit.ac.il"
          }
        ],
      },
      "first-team": {
        title: "תיאום עם צוות הקורס",
        action: "קיימו שיחת היכרות ותיאום עם מרצים ומתרגלים נוספים בקורס לפני תחילת הסמסטר. במידת הצורך ניתן לתאם נוכחות של צוות המרכז לקידום ההוראה בפגישה לחשיבה על דיוק הקורס לקראת הסמסטר.",
        contact: "אם אינכם יודעים מי שותף לצוות הקורס פנו למזכירות המחלקה.",
        bulletsTitle: "נקודות לתיאום בצוות:",
        bullets: [
          "חלוקה במשימות עדכון תכני הקורס",
          "אחידות בדרישות ובמדיניות מתן ציונים.",
          "סנכרון מועדי בחנים והגשות."
        ],
      },
      "first-center": {
        title: "פגישה עם המרכז לקידום ההוראה",
        action: "קבעו פגישת היכרות שבה תוכלו למפות צרכים, לקבל הכוונה ולהכיר את מעטפת הליווי בשנת ההוראה הראשונה.",
        contact: "המרכז לקידום ההוראה.",
        bulletsTitle: "לתיאום פגישה:",
        bullets: [
          {
            label: "מרכז לקידום ההוראה",
            text: "טופס פנייה למרכז לקידום ההוראה",
            url: "https://www.hit.ac.il/staff/teaching-center/#contact"
          }
        ],
      }
    }
  };
})();
