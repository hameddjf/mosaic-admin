/* ============================================================
   Mosaic Admin — shared JS
   Loaded on every page. Each block checks for its target
   element before running, so one file works everywhere.
   ============================================================ */

/* ---------- Theme toggle (defaults to dark) ---------- */
function toggleTheme(){
  const body = document.body;
  const isDark = body.getAttribute('data-theme') === 'dark';
  body.setAttribute('data-theme', isDark ? 'light' : 'dark');
  const btn = document.getElementById('theme-btn');
  if(btn) btn.textContent = isDark ? '☀️' : '🌙';
}

/* ---------- Brand palette toggle: DELTIZE (default) / Classic ---------- */
function currentBrand(){ return sessionStorage.getItem('mosaic_brand') || 'deltize'; }
function applyBrand(brand){
  document.body.setAttribute('data-brand', brand);
  const btn = document.getElementById('brand-btn');
  if(btn) btn.textContent = brand === 'deltize' ? '◆' : '◇';
  if(btn) btn.title = brand === 'deltize' ? 'رنگ: دلتیز (فعال) — کلیک برای کلاسیک' : 'رنگ: کلاسیک (فعال) — کلیک برای دلتیز';
  sessionStorage.setItem('mosaic_brand', brand);
  // re-render any charts on this page so they pick up the new accent color
  // (Chart.js bakes colors into the dataset at creation time)
  if(typeof renderChart === 'function'){
    renderChart(); renderRevenueChart(); renderCategoryChart(); renderPaymentMethodChart();
  }
}
function toggleBrand(){
  applyBrand(currentBrand() === 'deltize' ? 'classic' : 'deltize');
  // re-render any charts on this page so their colors follow the new brand
  renderChart();
  renderRevenueChart();
  renderCategoryChart();
  renderPaymentMethodChart();
}

/* ---------- Mobile sidebar ---------- */
function toggleSidebar(){
  const sb = document.getElementById('sidebar');
  if(!sb) return;
  const isOpen = sb.classList.toggle('open');
  let backdrop = document.getElementById('sidebar-backdrop');
  if(isOpen){
    if(!backdrop){
      backdrop = document.createElement('div');
      backdrop.id = 'sidebar-backdrop';
      backdrop.className = 'sidebar-backdrop';
      backdrop.addEventListener('click', toggleSidebar);
      document.body.appendChild(backdrop);
    }
    document.body.style.overflow = 'hidden';
  } else {
    if(backdrop) backdrop.remove();
    document.body.style.overflow = '';
  }
}

/* ---------- Login page → app ---------- */
function submitLogin(e){
  if(e) e.preventDefault();
  window.location.href = '../index.html';
}

/* ============================================================
   Bilingual (FA / EN) support
   Persian text is kept in the HTML as the source of truth.
   The dictionary below maps exact Persian strings to their
   English equivalent. translatePage() walks leaf text nodes
   and swaps them (and placeholders) based on the active
   language, which is remembered for the whole browser tab via
   sessionStorage so it stays consistent while navigating
   between pages.
   ============================================================ */
const FA_EN = {
  // sidebar / shared chrome
  'پنل موزاییک':'Mosaic Admin', 'داشبورد':'Dashboard', 'سفارش‌ها':'Orders',
  'افزودن محصول':'Add Product', 'تنظیمات':'Settings', 'گزارش‌ها':'Reports',
  'تحلیل فروش':'Sales Analytics', 'تراکنش‌ها':'Transactions', 'اصلی':'Main',
  'سارا احمدی':'Sara Ahmadi', 'مدیر فروشگاه':'Store Manager', 'خروج از حساب':'Log out',
  'جستجو...':'Search...', 'منو':'Menu',
  // buttons / generic
  'ذخیره':'Save', 'انصراف':'Cancel', 'بستن':'Close', 'حذف':'Delete', 'ویرایش':'Edit',
  'مشاهده':'View', 'ورود':'Sign in', 'خروج':'Log out', 'ثبت‌نام کنید':'Sign up',
  'بازگشت به ورود':'Back to sign in', 'ارسال کد بازیابی':'Send reset code',
  'تایید کد':'Verify code', 'تایید و ورود':'Verify & continue', 'ارسال مجدد':'Resend',
  'ایجاد حساب':'Create account', 'ذخیره رمز عبور':'Save password',
  '+ سفارش جدید':'+ New Order', 'خروجی Excel':'Export Excel', 'ثبت سفارش':'Save Order',
  'ذخیره و انتشار':'Save & Publish', 'ذخیره پیش‌نویس':'Save Draft',
  'ذخیره تغییرات':'Save Changes', 'حذف سفارش':'Delete Order',
  'مشاهده همه':'View all', 'مشاهده همه ←':'View all ←',
  // login/register/auth
  'ورود به پنل مدیریت':'Sign in to your panel', 'برای دسترسی به داشبورد، وارد حساب کاربری خود شوید':'Sign in to access your dashboard',
  'ایمیل یا نام کاربری':'Email or username', 'رمز عبور':'Password', 'مرا به خاطر بسپار':'Remember me',
  'فراموشی رمز عبور؟':'Forgot password?', 'حساب کاربری ندارید؟':"Don't have an account?",
  'ساخت حساب کاربری':'Create your account', 'برای شروع، اطلاعات زیر را تکمیل کنید':'Fill in your details to get started',
  'نام و نام خانوادگی':'Full name', 'ایمیل':'Email', 'تکرار رمز عبور':'Confirm password',
  'قبلاً ثبت‌نام کرده‌اید؟':'Already have an account?',
  'تایید آدرس ایمیل':'Verify your email', 'کد جدید ارسال شد':'A new code was sent',
  'کدی دریافت نکردید؟':"Didn't receive a code?",
  'بازیابی رمز عبور':'Reset password', 'ایمیل حساب کاربری خود را وارد کنید تا کد بازیابی برای شما ارسال شود':'Enter your account email to receive a reset code',
  'رمز عبورتان را به خاطر آوردید؟':'Remembered your password?',
  'تایید کد بازیابی':'Verify reset code', 'کد ۵ رقمی ارسال‌شده به ایمیل خود را وارد کنید':'Enter the 5-digit code sent to your email',
  'تعیین رمز عبور جدید':'Set a new password', 'رمز عبور جدید باید حداقل ۸ کاراکتر باشد':'New password must be at least 8 characters',
  'رمز عبور جدید':'New password',
  // dashboard
  'خوش آمدید، سارا 👋':'Welcome back, Sara 👋', 'خلاصه‌ای از عملکرد فروشگاه شما در ۳۰ روز گذشته':'A summary of your store performance over the last 30 days',
  'درآمد کل (تومان)':'Total Revenue (Toman)', 'سفارش‌های جدید':'New Orders', 'مشتریان فعال':'Active Customers',
  'نرخ بازگشت کالا':'Return Rate', 'روند فروش':'Sales Trend', 'هفتگی':'Weekly', 'ماهانه':'Monthly', 'سالانه':'Yearly',
  'فعالیت‌های اخیر':'Recent Activity', 'امروز':'Today', 'پرفروش‌ترین محصولات':'Best-selling Products',
  'محصول':'Product', 'دسته‌بندی':'Category', 'فروش':'Sales', 'موجودی':'Stock', 'درآمد':'Revenue',
  'کیف چرم دستی':'Handmade Leather Bag', 'کفش اسپرت مدل آترا':'Atra Sport Shoes', 'ساعت مچی کلاسیک':'Classic Wristwatch',
  'اکسسوری':'Accessories', 'پوشاک':'Apparel',
  'سفارش #۱۰۴۸ تکمیل شد':'Order #1048 completed', 'مشتری جدید ثبت‌نام کرد':'A new customer signed up',
  'موجودی «کیف چرم دستی» رو به اتمام است':'"Leather Bag" stock is running low', 'پرداخت سفارش #۱۰۴۲ ناموفق بود':'Payment for order #1042 failed',
  '۲ دقیقه پیش':'2 min ago', '۱۸ دقیقه پیش':'18 min ago', '۱ ساعت پیش':'1 hour ago', '۳ ساعت پیش':'3 hours ago',
  // orders
  'مدیریت سفارش‌ها':'Manage Orders', 'مشاهده، فیلتر و پیگیری تمام سفارش‌های ثبت‌شده':'View, filter and track all your orders',
  'همه':'All', 'در حال پردازش':'Processing', 'ارسال‌شده':'Shipped', 'لغو‌شده':'Cancelled',
  'جستجوی سفارش...':'Search orders...', 'شناسه':'ID', 'مشتری':'Customer', 'تاریخ':'Date',
  'مبلغ':'Amount', 'وضعیت':'Status', 'پرداخت':'Payment',
  // new order
  'ثبت سفارش جدید':'Create New Order', 'اطلاعات مشتری و سفارش را وارد کنید':'Enter customer and order details',
  'نام مشتری':'Customer Name', 'شماره تماس':'Phone Number', 'تاریخ سفارش':'Order Date',
  'مبلغ کل (تومان)':'Total Amount (Toman)', 'وضعیت سفارش':'Order Status', 'وضعیت پرداخت':'Payment Status',
  'آدرس ارسال':'Shipping Address', 'اقلام سفارش':'Order Items', 'بازگشت به سفارش‌ها':'Back to Orders',
  'پرداخت‌شده':'Paid', 'در انتظار':'Pending', 'بازگشت وجه':'Refunded',
  // add product
  'افزودن محصول جدید':'Add New Product', 'اطلاعات محصول را برای انتشار در فروشگاه تکمیل کنید':'Fill in the product details to publish it to your store',
  'نام محصول':'Product Name', 'قیمت (تومان)':'Price (Toman)', 'موجودی انبار':'Stock Quantity',
  'توضیحات محصول':'Product Description', 'وضعیت انتشار':'Publish Status', 'برچسب‌ها':'Tags',
  'پیش‌نویس':'Draft', 'منتشر شده':'Published', 'ناموجود':'Out of stock',
  // settings
  'تنظیمات حساب کاربری و ترجیحات پنل':'Account settings and panel preferences', 'پروفایل':'Profile',
  'اعلان‌ها':'Notifications', 'امنیت':'Security', 'ظاهر پنل':'Appearance',
  'اعلان‌های ایمیلی':'Email Notifications', 'دریافت خلاصه فروش روزانه از طریق ایمیل':'Receive a daily sales summary by email',
  'اعلان سفارش جدید':'New Order Alerts', 'نمایش اعلان فوری هنگام ثبت سفارش جدید':'Show an instant alert when a new order comes in',
  'حالت دو مرحله‌ای ورود':'Two-Factor Authentication', 'افزایش امنیت حساب با تایید پیامکی':'Add extra security with SMS verification',
  'حالت تیره خودکار':'Auto Dark Mode', 'تغییر خودکار تم بر اساس تنظیمات سیستم':'Automatically switch theme based on system settings',
  // sales analytics / transactions
  'گزارش کامل فروش و عملکرد فروشگاه در بازه‌های زمانی مختلف':'A full report of your store sales and performance over time',
  'تراکنش‌های مالی و وضعیت پرداخت‌ها':'Financial transactions and payment status', 'روش پرداخت':'Payment Method',
  'موفق':'Successful', 'ناموفق':'Failed',
  // cart / checkout / payment
  'سبد خرید':'Cart', 'سبد خرید شما':'Your Cart', 'اطلاعات ارسال':'Shipping Info',
  'تایید نهایی':'Confirmation', 'خلاصه سفارش':'Order Summary',
  'کد تخفیف را وارد کنید':'Enter discount code', 'اعمال کد':'Apply', 'مبلغ قابل پرداخت':'Amount Due',
  'ادامه فرآیند خرید ←':'Continue to Checkout ←', 'بازگشت به فروشگاه':'Back to Store',
  'پرداخت ۱۰۰٪ امن':'100% Secure Payment', '۷ روز ضمانت بازگشت وجه':'7-Day Money-back Guarantee',
  'ارسال ۲ تا ۴ روزه':'2–4 Day Delivery', 'ضمانت اصالت کالا':'Authenticity Guarantee',
  'روش پرداخت':'Payment Method', 'زرین‌پال':'ZarinPal', 'درگاه بانک ملت':'Mellat Bank Gateway',
  'درگاه ملت':'Mellat Gateway', 'درگاه سامان':'Saman Gateway', 'کیف پول':'Wallet',
  'درگاه بانک سامان':'Saman Bank Gateway', 'زیبال':'Zibal', 'پرداخت آنلاین با تمام کارت‌ها':'Online payment with all cards',
  'پرداخت مستقیم بانکی':'Direct bank payment', 'پرداخت و تکمیل سفارش':'Pay & Complete Order',
  'بازگشت به سبد خرید':'Back to Cart', 'برای پیش‌نمایش نتایج مختلف:':'Preview different outcomes:',
  'در انتظار':'Pending',
  'پرداخت با موفقیت انجام شد':'Payment Successful', 'سفارش شما ثبت شد و به‌زودی پردازش می‌شود. رسید خرید به ایمیل شما ارسال گردید.':'Your order has been placed and will be processed shortly. A receipt has been sent to your email.',
  'شماره سفارش':'Order Number', 'مبلغ پرداخت‌شده':'Amount Paid', 'کد پیگیری':'Tracking Code',
  'مشاهده سفارش':'View Order',
  'پرداخت ناموفق بود':'Payment Failed', 'متاسفانه در فرآیند پرداخت مشکلی پیش آمد. مبلغی از حساب شما کسر نشده است.':'Unfortunately something went wrong during payment. No amount has been deducted from your account.',
  'شماره پیگیری':'Tracking Number', 'علت':'Reason', 'موجودی ناکافی':'Insufficient balance', 'زمان':'Time',
  'تلاش مجدد':'Try Again',
  'در انتظار تایید پرداخت':'Awaiting Payment Confirmation', 'پرداخت شما در حال بررسی توسط بانک است. این فرآیند معمولاً کمتر از چند دقیقه طول می‌کشد.':'Your payment is being reviewed by the bank. This usually takes a few minutes.',
  'وضعیت':'Status', 'بررسی وضعیت':'Check Status',
  // extra coverage: cart items, checkout form, misc
  'جمع جزء':'Subtotal', 'کیف چرم دستی مدل بارین':'Barin Leather Handbag', 'کفش اسپرت مدل آترا':'Atra Sport Shoes',
  'کمربند چرم طبیعی':'Genuine Leather Belt',
  'رنگ: قهوه‌ای تیره / سایز: متوسط':'Color: Dark Brown / Size: Medium',
  'سایز: ۴۲ / رنگ: مشکی':'Size: 42 / Color: Black', 'رنگ: قهوه‌ای':'Color: Brown',
  'آدرس کامل':'Full Address', 'استان':'Province', 'کد پستی':'Postal Code',
  'تهران':'Tehran', 'اصفهان':'Isfahan', 'فارس':'Fars',
  'رنگ: دلتیز':'Color: Deltize', 'رنگ: کلاسیک':'Color: Classic',
  // page <title> segments not already covered above
  'ثبت‌نام':'Register', 'تسویه حساب':'Checkout', 'فراموشی رمز عبور':'Forgot Password',
  'سفارش جدید':'New Order', 'پرداخت ناموفق':'Payment Failed', 'پرداخت موفق':'Payment Successful',
  'تغییر رمز عبور':'Change Password', 'تایید ایمیل':'Verify Email',
  // error pages
  'این صفحه پیدا نشد':'Page Not Found', 'صفحه پیدا نشد':'Page Not Found', 'آدرسی که دنبالش بودید وجود ندارد یا جابه‌جا شده است. می‌توانید از لینک‌های زیر ادامه دهید.':"The page you're looking for doesn't exist or has moved. You can continue from the links below.",
  'بازگشت به داشبورد':'Back to Dashboard', 'صفحه ورود':'Sign-in Page',
  'دسترسی غیرمجاز':'Access Denied', 'دسترسی شما مجاز نیست':"You don't have access",
  'شما اجازه‌ی مشاهده‌ی این بخش را ندارید. اگر فکر می‌کنید این یک اشتباه است، با مدیر سیستم تماس بگیرید.':'You do not have permission to view this section. If you think this is a mistake, contact your administrator.',
  'ورود با حساب دیگر':'Sign in with another account',
  'خطای سرور':'Server Error', 'مشکلی در سرور پیش آمد':'Something went wrong on our end',
  'مشکل از سمت شما نیست. تیم فنی از این خطا مطلع شد؛ لطفاً چند دقیقه دیگر دوباره تلاش کنید.':"It's not you — it's us. Our team has been notified; please try again in a few minutes.",
  // placeholders that were still missing
  'حداقل ۸ کاراکتر':'At least 8 characters', 'مثلاً سارا احمدی':'e.g. Sara Ahmadi',
  'استان، شهر، آدرس کامل':'Province, city, full address', 'مثلاً نگین رضایی':'e.g. Negin Rezaei',
  'مثلاً: کیف چرم دستی × ۱، کمربند چرم × ۲':'e.g. Leather Bag × 1, Leather Belt × 2',
  '۰۹۱۲xxxxxxx':'e.g. 555-0100', '۱,۲۵۰,۰۰۰':'e.g. 1,250,000', '۱۴۰۳/۰۵/۱۳':'2026-08-04',
  'تخفیف‌دار، پرفروش، جدید':'On sale, Best-seller, New', 'مثلاً کیف چرم دستی':'e.g. Leather Handbag',
  'ویژگی‌ها، جنس، رنگ‌بندی و سایر جزئیات محصول را بنویسید...':'Describe features, material, color options and other product details...',
  '۴۰':'40', 'جستجوی شناسه تراکنش...':'Search transaction ID...',
  // second full pass — everything the audit script found still untranslated
  'تکرار رمز عبور جدید':'Confirm New Password',
  'کد ۵ رقمی ارسال‌شده به ایمیل شما را وارد کنید':'Enter the 5-digit code sent to your email',
  'رایگان':'Free', 'هزینه ارسال':'Shipping Cost', 'در انتظار تایید':'Awaiting Confirmation',
  'هر قلم را با کاما از هم جدا کنید.':'Separate each item with a comma.',
  'حداکثر ۶۰۰ نویسه — توضیح واضح باعث افزایش نرخ خرید می‌شود.':'Up to 600 characters — a clear description increases conversion.',
  'لوازم خانگی':'Home Goods', 'کفش':'Shoes',
  // sales-analytics.html
  'این ماه':'This Month', 'بازدید':'Visits',
  'بررسی روند درآمد، دسته‌بندی‌ها و عملکرد محصولات':'Track revenue trends, category share, and product performance',
  'خرید مجدد مشتریان':'Repeat Purchases', 'درآمد این ماه (تومان)':'Revenue This Month (Toman)',
  'روند درآمد ۱۲ ماه اخیر':'Revenue Trend — Last 12 Months', 'سهم فروش به تفکیک دسته':'Sales Share by Category',
  'عملکرد محصولات':'Product Performance', 'عینک آفتابی رتیک':'Retik Sunglasses',
  'میانگین ارزش سفارش':'Average Order Value', 'نرخ تبدیل':'Conversion Rate',
  'نرخ تبدیل بازدید به خرید':'Visit-to-Purchase Conversion Rate', 'کوله پشتی سفری':'Travel Backpack',
  'کیف':'Bag', '۳۰ روز گذشته':'Last 30 Days',
  // transactions.html
  'تاریخچه‌ی کامل تراکنش‌های مالی فروشگاه':'Complete history of your store financial transactions',
  'تراکنش #TXN-2291 با خطای موجودی ناکافی رد شد':'Transaction #TXN-2291 was declined due to insufficient balance',
  'تراکنش موفق':'Transaction Successful', 'تراکنش ناموفق':'Transaction Failed',
  'تسویه‌ی ۸۴,۲۰۰,۰۰۰ تومان با زرین‌پال انجام شد':'A settlement of 84,200,000 Toman was completed via ZarinPal',
  'درخواست تسویه‌ی جدید ثبت شد':'A new settlement request was submitted', 'دیروز':'Yesterday',
  'سفارش':'Order', 'سهم روش‌های پرداخت':'Payment Method Share', 'شناسه تراکنش':'Transaction ID',
  'نمایش ۱ تا ۶ از ۵۸ نتیجه':'Showing 1–6 of 58 results', 'وضعیت تسویه با درگاه':'Gateway Settlement Status',
  '۴ ساعت پیش':'4 hours ago',
  // orders.html
  'نمایش ۱ تا ۸ از ۱۲۸ نتیجه':'Showing 1–8 of 128 results',
  // register.html checkbox (text is split around an inline link)
  'با':'I agree to the', 'موافقم':'', 'قوانین و مقررات':'Terms & Conditions',
  // landing.html — full marketing page coverage
  'پنل موزاییک — قالب مدیریتی فارسی':'Mosaic Admin — Persian Admin Panel Template',
  '◆ راست‌چین، فارسی، و حالا دوزبانه':'◆ RTL, Persian, and now bilingual',
  'قالب پنل مدیریتی که':'The admin template that', 'نمی‌ده':"doesn't feel", 'حس ترجمه‌شده':'translated',
  'HTML، CSS و جاوااسکریپت خالص. مسیر کامل احراز هویت و خرید/پرداخت، دکمه‌های کاملاً کاربردی، و سوییچ فارسی/انگلیسی — بدون فریمورک، بدون وابستگی سنگین.':'Pure HTML, CSS and JavaScript. A complete auth and checkout flow, fully working buttons, and a Persian/English switch — no framework, no heavy dependencies.',
  'مشاهده دمو زنده ←':'See Live Demo ←', 'مشاهده دمو':'View Demo', 'مشاهده قیمت':'See Pricing',
  'صفحه کامل':'Pages', '۲۰ صفحه کامل HTML/CSS/JS':'20 complete HTML/CSS/JS pages',
  'زبان (فارسی / انگلیسی)':'Languages (FA/EN)', 'حالت رنگی (تیره/روشن)':'Color modes (dark/light)',
  'راست‌چین بومی':'Native RTL',
  'امکانات':'Features', 'هرچی که برای شروع لازم دارید':'Everything you need to get started',
  'یک قالب کامل، نه یک اسکلت خالی':'A complete template, not an empty skeleton',
  'راست‌چین واقعی':'True RTL', 'نه یک قالب انگلیسی با dir="rtl"، بلکه چیدمانی که از پایه برای فارسی طراحی شده — از آیکون‌ها تا اعداد فارسی.':'Not an English template with dir="rtl" bolted on — a layout built for Persian from the ground up, down to icons and numerals.',
  'حالت تیره و روشن':'Dark & Light Mode', 'سوییچ آنی بین دو تم با یک کلیک، بدون پرش رنگی یا چشمک زدن صفحه.':'Instant switch between two themes with one click, with no color flash or flicker.',
  'دوزبانه (فارسی/انگلیسی)':'Bilingual (FA/EN)', 'یک دکمه برای سوییچ کامل بین فارسی و انگلیسی، شامل چرخش خودکار جهت صفحه از راست‌چین به چپ‌چین.':'One button for a full switch between Persian and English, including automatic RTL-to-LTR direction change.',
  'مسیر کامل احراز هویت':'Full Auth Flow', 'ورود، ثبت‌نام، تایید ایمیل با کد، و بازیابی رمز عبور — همه صفحات به هم متصل و کاملاً کاربردی.':'Sign in, sign up, code-based email verification, and password recovery — every page connected and fully working.',
  'مسیر کامل خرید و پرداخت':'Full Cart & Checkout Flow', 'سبد خرید، تسویه حساب با انتخاب درگاه (زرین‌پال، ملت، سامان، زیبال)، و صفحات نتیجه پرداخت موفق/ناموفق/در انتظار.':'Cart, checkout with gateway selection (ZarinPal, Mellat, Saman, Zibal), and success/failed/pending payment results.',
  'فایل‌های مجزا':'Separate Files', 'هر صفحه یک فایل HTML جدا، با CSS و JS مشترک — مناسب برای شخصی‌سازی سریع بدون سردرگمی.':'Each page is its own HTML file sharing common CSS/JS — quick to customize without confusion.',
  'دکمه‌ها واقعاً کار می‌کنن':'Buttons That Actually Work', 'مودال‌های واقعی برای مشاهده/ویرایش/حذف سفارش، فرم سفارش جدید، خروجی CSV، و فیلترهای زنده روی جدول‌ها.':'Real modals for viewing/editing/deleting orders, a new-order form, CSV export, and live table filters.',
  'گزارش‌گیری و نمودار':'Reporting & Charts', 'صفحات تحلیل فروش و تراکنش‌ها با نمودارهای Chart.js، آماده برای اتصال به داده‌های واقعی فروشگاه شما.':'Sales analytics and transactions pages with Chart.js visuals, ready to connect to your real store data.',
  'بدون فریمورک':'No Framework', 'Vanilla JS خالص. بدون نیاز به build، npm یا وابستگی پیچیده — فقط باز کنید و استفاده کنید.':'Pure vanilla JS. No build step, no npm, no complex dependencies — just open it and go.',
  'پیش‌نمایش':'Preview', 'هر صفحه رو از نزدیک ببینید':'Take a closer look at every page',
  'سبد خرید شما خالی است':'Your cart is empty',
  'قیمت‌گذاری':'Pricing', 'یک‌بار بخرید، همیشه استفاده کنید':'Buy once, use forever',
  'لایسنس تجاری':'Commercial License', 'تومان':'Toman',
  'مسیر کامل احراز هویت (ورود، ثبت‌نام، بازیابی رمز)':'Full auth flow (sign in, sign up, password recovery)',
  'مسیر کامل خرید (سبد خرید، تسویه حساب، نتیجه پرداخت)':'Full purchase flow (cart, checkout, payment result)',
  'دوزبانه فارسی/انگلیسی با یک کلیک':'One-click Persian/English switch',
  'فایل‌های مجزا و مستندسازی‌شده (README)':'Separate, documented files (README)',
  'مجوز استفاده در پروژه‌های تجاری':'License for commercial projects',
  'پشتیبانی بروزرسانی رایگان':'Free update support', 'خرید قالب':'Buy Template',
  'قیمت':'Price', '© ۱۴۰۳ پنل موزاییک — تمام حقوق محفوظ است':'© 2024 Mosaic Admin — All rights reserved',
  // sidebar "other pages" group
  'دیگر صفحات':'Other Pages', 'ثبت‌نام':'Sign Up',
  'خطای ۴۰۴':'404 Error', 'خطای ۴۰۳':'403 Error', 'خطای ۵۰۰':'500 Error',
  // dynamic modal/toast phrases (order id is interpolated separately, see t())
  'جزئیات سفارش':'Order Details', 'ویرایش سفارش':'Edit Order', 'حذف سفارش':'Delete Order',
  'ویرایش شد':'was updated', 'حذف شد':'was deleted', 'نمایش تنظیمات':'Showing settings for',
  'آیا از حذف این سفارش مطمئن هستید؟ این عملیات غیرقابل بازگشت است.':'Are you sure you want to delete this order? This action cannot be undone.',
  // "all pages" preview links
  'همه صفحات پنل':'All Panel Pages', 'پیش‌نمایش سریع هر بخش':'Quick preview of every section',
  'سفارش جدید':'New Order', 'ثبت سفارش تازه':'Create a new order',
  'ثبت محصول در فروشگاه':'Add a product to the store',
  'نمودار درآمد و دسته‌بندی‌ها':'Revenue & category charts', 'پیگیری پرداخت‌ها':'Track payments',
  'سبد خرید':'Cart', 'مدیریت اقلام و تخفیف':'Manage items & discounts',
  'تسویه حساب':'Checkout', 'آدرس و انتخاب درگاه پرداخت':'Address & payment gateway selection',
  'پروفایل و اعلان‌ها':'Profile & notifications',
  'صفحه ورود به پنل':'Panel sign-in page',
  'صفحه فرود':'Landing Page', 'صفحه معرفی و فروش قالب':'Template showcase & sales page',
};
const EN_FA = Object.fromEntries(Object.entries(FA_EN).map(([fa,en]) => [en, fa]));

function currentLang(){ return sessionStorage.getItem('mosaic_lang') || 'fa'; }

/* Translate a single phrase used inside a JS template literal, e.g.
   `${t('حذف سفارش')} ${order.id}` */
function t(key){
  if(currentLang() !== 'en') return key;
  return FA_EN[key] !== undefined ? FA_EN[key] : key;
}

/* fa <-> en digits */
const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
function toEnDigits(str){ return str.replace(/[۰-۹]/g, d => FA_DIGITS.indexOf(d)); }

/* Walks the text nodes under root and swaps in the dictionary translation.
   Stashes the original Persian on the parent element the first time so
   switching back to fa just restores it verbatim (handles numbers,
   names, anything not in the dictionary). */
function translateLeafNodes(root, lang){
  const dict = lang === 'en' ? FA_EN : EN_FA;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (node)=>{
      const parentTag = node.parentElement ? node.parentElement.tagName : '';
      if(parentTag === 'SCRIPT' || parentTag === 'STYLE') return NodeFilter.FILTER_REJECT;
      return node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  const targets = [];
  let node;
  while(node = walker.nextNode()) targets.push(node);
  targets.forEach(node=>{
    const el = node.parentElement;
    if(!el) return;
    if(lang === 'en'){
      if(el.dataset.i18nOrig === undefined) el.dataset.i18nOrig = node.textContent;
      const raw = el.dataset.i18nOrig;
      const trimmed = raw.trim();
      const translated = dict[trimmed] !== undefined ? raw.replace(trimmed, dict[trimmed]) : raw;
      node.textContent = toEnDigits(translated);
    } else if(el.dataset.i18nOrig !== undefined){
      node.textContent = el.dataset.i18nOrig;
      delete el.dataset.i18nOrig;
    }
  });
  root.querySelectorAll('[placeholder]').forEach(el=>{
    if(lang === 'en'){
      if(el.dataset.i18nPlaceholderOrig === undefined) el.dataset.i18nPlaceholderOrig = el.getAttribute('placeholder');
      const raw = el.dataset.i18nPlaceholderOrig;
      el.setAttribute('placeholder', dict[raw] !== undefined ? dict[raw] : toEnDigits(raw));
    } else if(el.dataset.i18nPlaceholderOrig !== undefined){
      el.setAttribute('placeholder', el.dataset.i18nPlaceholderOrig);
      delete el.dataset.i18nPlaceholderOrig;
    }
  });
}

function applyLanguage(lang){
  document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : 'fa');
  document.documentElement.setAttribute('dir', lang === 'en' ? 'ltr' : 'rtl');
  document.body.classList.toggle('lang-en', lang === 'en');
  translateLeafNodes(document.body, lang);
  // translate the browser tab title's leading segment too (e.g. "داشبورد | Mosaic Admin")
  const dict = lang === 'en' ? FA_EN : EN_FA;
  const titleParts = document.title.split('|');
  if(titleParts.length > 1){
    const seg = titleParts[0].trim();
    if(dict[seg] !== undefined){
      document.title = dict[seg] + ' | ' + titleParts.slice(1).join('|').trim();
    }
  }
  const btn = document.getElementById('lang-btn');
  if(btn) btn.textContent = lang === 'en' ? 'FA' : 'EN';
  sessionStorage.setItem('mosaic_lang', lang);
  // re-render any charts on this page so their axis/legend labels
  // (weekdays, months, categories, payment gateways) follow the language
  if(typeof renderChart === 'function'){
    renderChart(); renderRevenueChart(); renderCategoryChart(); renderPaymentMethodChart();
  }
}

function toggleLang(){
  applyLanguage(currentLang() === 'en' ? 'fa' : 'en');
}

/* ============================================================
   Toast notifications
   ============================================================ */
function ensureToastStack(){
  let stack = document.querySelector('.toast-stack');
  if(!stack){
    stack = document.createElement('div');
    stack.className = 'toast-stack';
    document.body.appendChild(stack);
  }
  return stack;
}
function showToast(message, type){
  const stack = ensureToastStack();
  const el = document.createElement('div');
  el.className = 'toast' + (type ? ' ' + type : '');
  // translate on the fly if the panel is currently in English —
  // toasts are created after the page's one-time translation pass,
  // so they need their own lookup at display time.
  el.textContent = (currentLang() === 'en' && FA_EN[message] !== undefined) ? FA_EN[message] : message;
  stack.appendChild(el);
  setTimeout(()=>{
    el.style.opacity = '0';
    el.style.transition = 'opacity .2s ease';
    setTimeout(()=> el.remove(), 200);
  }, 2600);
}

/* ============================================================
   Modal dialog — reusable confirm/info modal
   ============================================================ */
function showModal({ title, body, confirmLabel, onConfirm, danger }){
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-box">
      <div class="modal-head">
        <h3>${title}</h3>
        <button class="modal-close" aria-label="بستن">✕</button>
      </div>
      <div class="modal-body">${body}</div>
      <div class="modal-actions">
        <button class="btn-primary" id="modal-confirm-btn" ${danger ? 'style="background:#E15B5B;color:#fff;"' : ''}>${confirmLabel || 'تایید'}</button>
        <button class="btn-ghost" id="modal-cancel-btn">انصراف</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  // same reasoning as showToast: this DOM was just created, so run
  // it through the translator immediately if English is active.
  translateLeafNodes(overlay, currentLang());
  const close = ()=> overlay.remove();
  overlay.querySelector('.modal-close').addEventListener('click', close);
  overlay.querySelector('#modal-cancel-btn').addEventListener('click', close);
  overlay.addEventListener('click', (e)=>{ if(e.target === overlay) close(); });
  overlay.querySelector('#modal-confirm-btn').addEventListener('click', ()=>{
    if(onConfirm) onConfirm();
    close();
  });
}

/* ============================================================
   Wire up dashboard / orders / form / settings action buttons.
   Uses event delegation so it works regardless of page.
   ============================================================ */
function initActionButtons(){

  // "+ سفارش جدید" (dashboard + orders page)
  document.querySelectorAll('.btn-primary').forEach(btn=>{
    if(btn.textContent.includes('سفارش جدید')){
      btn.addEventListener('click', ()=>{
        showModal({
          title: 'ثبت سفارش جدید',
          body: 'برای ثبت سفارش جدید، اطلاعات مشتری و اقلام سفارش را در فرم مربوطه وارد کنید. (این یک نمونه‌ی فرانت‌اند است — فرم واقعی را به بک‌اند خود متصل کنید.)',
          confirmLabel: 'رفتن به فرم سفارش',
          onConfirm: ()=> showToast('برای این دمو، فرم سفارش به فرم افزودن محصول متصل نشده — آن را به فرم سفارش واقعی خود لینک کنید.')
        });
      });
    }
  });

  // "خروجی Excel" — actually downloads a CSV of the visible orders
  document.querySelectorAll('.btn-ghost').forEach(btn=>{
    if(btn.textContent.includes('خروجی Excel')){
      btn.addEventListener('click', ()=>{
        exportOrdersCSV();
        showToast('فایل خروجی دانلود شد', 'success');
      });
    }
  });

  // Row actions in orders table: view / edit / delete
  const ordersBody = document.getElementById('orders-body');
  if(ordersBody){
    ordersBody.addEventListener('click', (e)=>{
      const btn = e.target.closest('button');
      if(!btn) return;
      const row = btn.closest('tr');
      const orderId = row?.querySelector('td')?.textContent?.trim() || '';
      const order = ORDERS.find(o => o.id === orderId);
      const title = btn.title;

      if(title === 'مشاهده' && order){
        showModal({
          title: `${t('جزئیات سفارش')} ${order.id}`,
          body: `
            <div style="display:flex; flex-direction:column; gap:12px; font-size:13.5px;">
              <div style="display:flex; justify-content:space-between; padding-bottom:10px; border-bottom:1px solid var(--border);">
                <span style="color:var(--fg-low);">مشتری</span><span>${order.name}</span>
              </div>
              <div style="display:flex; justify-content:space-between; padding-bottom:10px; border-bottom:1px solid var(--border);">
                <span style="color:var(--fg-low);">تاریخ سفارش</span><span class="mono">${order.date}</span>
              </div>
              <div style="display:flex; justify-content:space-between; padding-bottom:10px; border-bottom:1px solid var(--border);">
                <span style="color:var(--fg-low);">مبلغ</span><span class="mono">${order.amount} تومان</span>
              </div>
              <div style="display:flex; justify-content:space-between; padding-bottom:10px; border-bottom:1px solid var(--border);">
                <span style="color:var(--fg-low);">وضعیت سفارش</span><span class="badge ${order.badge}">${order.status}</span>
              </div>
              <div style="display:flex; justify-content:space-between;">
                <span style="color:var(--fg-low);">وضعیت پرداخت</span><span>${order.pay}</span>
              </div>
            </div>`,
          confirmLabel: 'بستن'
        });
      } else if(title === 'ویرایش' && order){
        showModal({
          title: `${t('ویرایش سفارش')} ${order.id}`,
          body: `
            <div style="display:flex; flex-direction:column; gap:14px;">
              <div class="field" style="margin:0;">
                <label>نام مشتری</label>
                <input type="text" id="edit-name" value="${order.name}">
              </div>
              <div class="field" style="margin:0;">
                <label>تاریخ</label>
                <input type="text" id="edit-date" value="${order.date}">
              </div>
              <div class="field" style="margin:0;">
                <label>مبلغ (تومان)</label>
                <input type="text" id="edit-amount" value="${order.amount}">
              </div>
              <div class="field" style="margin:0;">
                <label>وضعیت سفارش</label>
                <select id="edit-status">
                  <option ${order.status==='در حال پردازش'?'selected':''}>در حال پردازش</option>
                  <option ${order.status==='ارسال‌شده'?'selected':''}>ارسال‌شده</option>
                  <option ${order.status==='لغو‌شده'?'selected':''}>لغو‌شده</option>
                </select>
              </div>
              <div class="field" style="margin:0;">
                <label>وضعیت پرداخت</label>
                <select id="edit-pay">
                  <option ${order.pay==='پرداخت‌شده'?'selected':''}>پرداخت‌شده</option>
                  <option ${order.pay==='در انتظار'?'selected':''}>در انتظار</option>
                  <option ${order.pay==='بازگشت وجه'?'selected':''}>بازگشت وجه</option>
                </select>
              </div>
            </div>`,
          confirmLabel: 'ذخیره تغییرات',
          onConfirm: ()=>{
            order.name = document.getElementById('edit-name').value;
            order.date = document.getElementById('edit-date').value;
            order.amount = document.getElementById('edit-amount').value;
            order.status = document.getElementById('edit-status').value;
            order.pay = document.getElementById('edit-pay').value;
            order.badge = order.status === 'ارسال‌شده' ? 'badge-success' : order.status === 'لغو‌شده' ? 'badge-danger' : 'badge-warn';
            saveOrders();
            renderOrders();
            showToast(`${t('سفارش')} ${order.id} ${t('ویرایش شد')}`, 'success');
          }
        });
      } else if(title === 'حذف' && order){
        showModal({
          title: `${t('حذف سفارش')} ${order.id}`,
          body: t('آیا از حذف این سفارش مطمئن هستید؟ این عملیات غیرقابل بازگشت است.'),
          confirmLabel: t('حذف سفارش'),
          danger: true,
          onConfirm: ()=>{
            ORDERS = ORDERS.filter(o => o.id !== order.id);
            saveOrders();
            row.remove();
            showToast(`${t('سفارش')} ${order.id} ${t('حذف شد')}`, 'danger');
          }
        });
      }
    });
  }

  // Order status filter chips (orders.html) — real filtering
  if(document.getElementById('orders-body')){
    document.querySelectorAll('.filters .filter-chip[data-status]').forEach(chip=>{
      chip.addEventListener('click', ()=>{
        document.querySelectorAll('.filters .filter-chip').forEach(c=>c.classList.remove('active'));
        chip.classList.add('active');
        const status = chip.dataset.status;
        renderOrders(status === 'all' ? null : status);
      });
    });
  }

  // Transaction status filter chips (transactions.html) — real filtering
  if(document.getElementById('transactions-body')){
    document.querySelectorAll('.filters .filter-chip[data-status]').forEach(chip=>{
      chip.addEventListener('click', ()=>{
        document.querySelectorAll('.filters .filter-chip').forEach(c=>c.classList.remove('active'));
        chip.classList.add('active');
        const status = chip.dataset.status;
        renderTransactions(status === 'all' ? null : status);
      });
    });
    const txnSearch = document.getElementById('txn-search');
    if(txnSearch){
      txnSearch.addEventListener('input', ()=>{
        const activeChip = document.querySelector('.filters .filter-chip.active');
        const status = activeChip && activeChip.dataset.status !== 'all' ? activeChip.dataset.status : null;
        renderTransactions(status, txnSearch.value.trim());
      });
    }
  }

  // New-order form submit
  const newOrderForm = document.getElementById('new-order-form');
  if(newOrderForm){
    newOrderForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const name = document.getElementById('no-name').value.trim();
      const amount = document.getElementById('no-amount').value.trim();
      if(!name || !amount){ showToast('لطفاً نام مشتری و مبلغ را وارد کنید', 'danger'); return; }
      const nextIdNum = Math.max(...ORDERS.map(o => parseInt(o.id.replace('#',''), 10))) + 1;
      const status = document.getElementById('no-status').value;
      const pay = document.getElementById('no-pay').value;
      const newOrder = {
        id: '#' + nextIdNum,
        name,
        date: document.getElementById('no-date').value || '۱۴۰۳/۰۵/۱۳',
        amount,
        status,
        badge: status === 'ارسال‌شده' ? 'badge-success' : status === 'لغو‌شده' ? 'badge-danger' : 'badge-warn',
        pay
      };
      ORDERS.unshift(newOrder);
      saveOrders();
      showToast('سفارش جدید با موفقیت ثبت شد', 'success');
      setTimeout(()=> window.location.href = 'orders.html', 700);
    });
  }

  // Add-product form
  const productForm = document.querySelector('#v-form, .form-actions');
  const publishBtn = document.querySelector('.form-actions .btn-primary');
  const draftBtn = document.querySelector('.form-actions .btn-ghost');
  if(publishBtn){
    publishBtn.addEventListener('click', ()=> showToast('محصول با موفقیت منتشر شد', 'success'));
  }
  if(draftBtn){
    draftBtn.addEventListener('click', ()=> showToast('پیش‌نویس ذخیره شد'));
  }

  // Settings sub-nav (profile/notifications/security/payment/appearance) — visual tab switch
  document.querySelectorAll('.settings-nav .nav-item').forEach(tab=>{
    tab.addEventListener('click', ()=>{
      document.querySelectorAll('.settings-nav .nav-item').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      showToast(`${t('نمایش تنظیمات')} «${tab.textContent.trim()}»`);
    });
  });

  // Sales-trend period pills (dashboard)
  document.querySelectorAll('.tab-pills .pill').forEach(pill=>{
    pill.addEventListener('click', ()=>{
      document.querySelectorAll('.tab-pills .pill').forEach(p=>p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  // Pagination buttons
  document.querySelectorAll('.page-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      if(!/[\u06F0-\u06F9]/.test(btn.textContent)) return; // ignore ‹ ›
      document.querySelectorAll('.page-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Mobile sidebar toggle button (shown on small screens).
  // NOTE: the button also has onclick="toggleSidebar()" in the HTML —
  // do NOT also bind it here, or every tap fires it twice (open then
  // immediately close) and the menu looks completely broken.
}

function exportOrdersCSV(){
  const rows = [['شناسه','مشتری','تاریخ','مبلغ','وضعیت','پرداخت']];
  ORDERS.forEach(o=> rows.push([o.id, o.name, o.date, o.amount, o.status, o.pay]));
  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'orders.csv';
  a.click();
  URL.revokeObjectURL(url);
}

/* ---------- Orders table (orders.html + index.html) ----------
   Persisted in sessionStorage so edits/new orders/deletes made on
   one page are reflected when you navigate to another page in the
   same browser tab (no backend needed for this demo). ---------- */
const DEFAULT_ORDERS = [
  {id:'#10482', name:'نگین رضایی',  date:'۱۴۰۳/۰۵/۱۲', amount:'۲,۴۵۰,۰۰۰', status:'ارسال‌شده',      badge:'badge-success', pay:'پرداخت‌شده'},
  {id:'#10481', name:'امیر حسینی',  date:'۱۴۰۳/۰۵/۱۲', amount:'۸۹۰,۰۰۰',   status:'در حال پردازش', badge:'badge-warn',    pay:'پرداخت‌شده'},
  {id:'#10480', name:'مریم کریمی',  date:'۱۴۰۳/۰۵/۱۱', amount:'۳,۱۲۰,۰۰۰', status:'ارسال‌شده',      badge:'badge-success', pay:'پرداخت‌شده'},
  {id:'#10479', name:'رضا اکبری',   date:'۱۴۰۳/۰۵/۱۱', amount:'۵۶۰,۰۰۰',   status:'لغو‌شده',        badge:'badge-danger',  pay:'بازگشت وجه'},
  {id:'#10478', name:'سمیرا قاسمی', date:'۱۴۰۳/۰۵/۱۰', amount:'۱,۷۸۰,۰۰۰', status:'در حال پردازش', badge:'badge-warn',    pay:'در انتظار'},
  {id:'#10477', name:'حسین نوری',   date:'۱۴۰۳/۰۵/۱۰', amount:'۴,۰۰۰,۰۰۰', status:'ارسال‌شده',      badge:'badge-success', pay:'پرداخت‌شده'},
  {id:'#10476', name:'الهام صادقی', date:'۱۴۰۳/۰۵/۰۹', amount:'۹۵۰,۰۰۰',   status:'ارسال‌شده',      badge:'badge-success', pay:'پرداخت‌شده'},
  {id:'#10475', name:'کاوه محمدی',  date:'۱۴۰۳/۰۵/۰۹', amount:'۲,۲۰۰,۰۰۰', status:'در حال پردازش', badge:'badge-warn',    pay:'در انتظار'},
];

function loadOrders(){
  try{
    const raw = sessionStorage.getItem('mosaic_orders');
    if(raw) return JSON.parse(raw);
  }catch(e){}
  return DEFAULT_ORDERS.slice();
}
function saveOrders(){
  try{ sessionStorage.setItem('mosaic_orders', JSON.stringify(ORDERS)); }catch(e){}
}
let ORDERS = loadOrders();

function renderOrders(statusFilter){
  const tbody = document.getElementById('orders-body');
  if(!tbody) return;
  const list = statusFilter ? ORDERS.filter(o => o.status === statusFilter) : ORDERS;
  tbody.innerHTML = list.map(o => `
    <tr>
      <td class="mono">${o.id}</td>
      <td><div class="cust"><div class="avatar"></div>${o.name}</div></td>
      <td class="mono">${o.date}</td>
      <td class="mono">${o.amount}</td>
      <td><span class="badge ${o.badge}">${o.status}</span></td>
      <td>${o.pay}</td>
      <td><div class="row-actions">
        <button title="مشاهده">👁</button>
        <button title="ویرایش">✎</button>
        <button title="حذف">🗑</button>
      </div></td>
    </tr>`).join('') || `<tr><td colspan="7" style="text-align:center; color:var(--fg-low); padding:24px;">سفارشی با این وضعیت یافت نشد</td></tr>`;
  // freshly-built rows start out in Persian regardless of source data,
  // so translate them into the active language right away
  translateLeafNodes(tbody, currentLang());
}

/* ---------- Transactions table (transactions.html) ---------- */
const TRANSACTIONS = [
  {txn:'TXN-2298', order:'#10482', method:'زرین‌پال',   date:'۱۴۰۳/۰۵/۱۲', amount:'۲,۴۵۰,۰۰۰', status:'موفق',       badge:'badge-success'},
  {txn:'TXN-2297', order:'#10481', method:'درگاه ملت',   date:'۱۴۰۳/۰۵/۱۲', amount:'۸۹۰,۰۰۰',   status:'در انتظار', badge:'badge-warn'},
  {txn:'TXN-2296', order:'#10480', method:'زرین‌پال',   date:'۱۴۰۳/۰۵/۱۱', amount:'۳,۱۲۰,۰۰۰', status:'موفق',       badge:'badge-success'},
  {txn:'TXN-2295', order:'#10479', method:'کیف پول',     date:'۱۴۰۳/۰۵/۱۱', amount:'۵۶۰,۰۰۰',   status:'بازگشت وجه', badge:'badge-danger'},
  {txn:'TXN-2294', order:'#10478', method:'درگاه سامان', date:'۱۴۰۳/۰۵/۱۰', amount:'۱,۷۸۰,۰۰۰', status:'در انتظار', badge:'badge-warn'},
  {txn:'TXN-2291', order:'#10471', method:'زرین‌پال',   date:'۱۴۰۳/۰۵/۰۹', amount:'۹۵۰,۰۰۰',   status:'ناموفق',     badge:'badge-danger'},
];

function renderTransactions(statusFilter, searchTerm){
  const tbody = document.getElementById('transactions-body');
  if(!tbody) return;
  let list = statusFilter ? TRANSACTIONS.filter(t => t.status === statusFilter) : TRANSACTIONS;
  if(searchTerm){
    const q = searchTerm.toLowerCase();
    list = list.filter(t => t.txn.toLowerCase().includes(q) || t.order.toLowerCase().includes(q));
  }
  tbody.innerHTML = list.map(t => `
    <tr>
      <td class="mono">${t.txn}</td>
      <td class="mono">${t.order}</td>
      <td>${t.method}</td>
      <td class="mono">${t.date}</td>
      <td class="mono">${t.amount}</td>
      <td><span class="badge ${t.badge}">${t.status}</span></td>
    </tr>`).join('') || `<tr><td colspan="6" style="text-align:center; color:var(--fg-low); padding:24px;">تراکنشی یافت نشد</td></tr>`;
  translateLeafNodes(tbody, currentLang());
}

/* ---------- Chart color helpers (read the live CSS variables so
   every chart follows whichever brand — DELTIZE or Classic — is
   currently active, instead of a hardcoded hex value) ---------- */
function cssVar(name){ return getComputedStyle(document.body).getPropertyValue(name).trim(); }
function accentColor(){ return cssVar('--accent') || '#06B6D4'; }
function accentRgba(alpha){
  const hex = accentColor().replace('#','');
  const r = parseInt(hex.substring(0,2),16), g = parseInt(hex.substring(2,4),16), b = parseInt(hex.substring(4,6),16);
  return `rgba(${r},${g},${b},${alpha})`;
}

let _salesChart, _revenueChart, _categoryChart, _paymentMethodChart;

/* ---------- Sales chart (index.html) ---------- */
function renderChart(){
  const ctx = document.getElementById('salesChart');
  if(!ctx || typeof Chart === 'undefined') return;
  if(_salesChart) _salesChart.destroy();
  _salesChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: currentLang() === 'en'
        ? ['Sat','Sun','Mon','Tue','Wed','Thu','Fri']
        : ['شنبه','یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه','جمعه'],
      datasets: [{
        label: currentLang() === 'en' ? 'Sales' : 'فروش',
        data: [42, 58, 49, 71, 63, 84, 76],
        borderColor: accentColor(),
        backgroundColor: accentRgba(0.12),
        fill: true,
        tension: .4,
        pointRadius: 3,
        pointBackgroundColor: accentColor(),
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#7986A3', font: { family: 'Vazirmatn' } } },
        y: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#7986A3', font: { family: 'Vazirmatn' } } }
      }
    }
  });
}

/* ---------- Revenue trend chart (sales-analytics.html) ---------- */
function renderRevenueChart(){
  const ctx = document.getElementById('revenueChart');
  if(!ctx || typeof Chart === 'undefined') return;
  if(_revenueChart) _revenueChart.destroy();
  _revenueChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: currentLang() === 'en'
        ? ['Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug']
        : ['شهریور','مهر','آبان','آذر','دی','بهمن','اسفند','فروردین','اردیبهشت','خرداد','تیر','مرداد'],
      datasets: [{
        label: currentLang() === 'en' ? 'Revenue (Million Toman)' : 'درآمد (میلیون تومان)',
        data: [210, 240, 198, 260, 300, 275, 320, 290, 340, 365, 410, 482],
        backgroundColor: accentColor(),
        borderRadius: 4,
        maxBarThickness: 22,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#7986A3', font: { family: 'Vazirmatn', size: 11 } } },
        y: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#7986A3', font: { family: 'Vazirmatn' } } }
      }
    }
  });
}

/* ---------- Category breakdown chart (sales-analytics.html) ---------- */
function renderCategoryChart(){
  const ctx = document.getElementById('categoryChart');
  if(!ctx || typeof Chart === 'undefined') return;
  if(_categoryChart) _categoryChart.destroy();
  _categoryChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: currentLang() === 'en'
        ? ['Accessories', 'Apparel', 'Bags', 'Shoes', 'Other']
        : ['اکسسوری', 'پوشاک', 'کیف', 'کفش', 'سایر'],
      datasets: [{
        data: [38, 22, 18, 16, 6],
        backgroundColor: [accentColor(), '#4C8DFF', '#3FB68B', '#E15B5B', '#7986A3'],
        borderWidth: 0,
      }]
    },
    options: {
      responsive: true,
      cutout: '68%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#AEB8CE', font: { family: 'Vazirmatn', size: 11.5 }, padding: 14, usePointStyle: true, pointStyle: 'circle' }
        }
      }
    }
  });
}

/* ---------- Payment method chart (transactions.html) ---------- */
function renderPaymentMethodChart(){
  const ctx = document.getElementById('paymentMethodChart');
  if(!ctx || typeof Chart === 'undefined') return;
  if(_paymentMethodChart) _paymentMethodChart.destroy();
  _paymentMethodChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: currentLang() === 'en'
        ? ['ZarinPal', 'Mellat Gateway', 'Saman Gateway', 'Wallet']
        : ['زرین‌پال', 'درگاه ملت', 'درگاه سامان', 'کیف پول'],
      datasets: [{
        label: currentLang() === 'en' ? 'Transaction Count' : 'تعداد تراکنش',
        data: [612, 284, 176, 70],
        backgroundColor: [accentColor(), '#4C8DFF', '#3FB68B', '#7986A3'],
        borderRadius: 4,
        maxBarThickness: 30,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#7986A3', font: { family: 'Vazirmatn' } } },
        y: { grid: { display: false }, ticks: { color: '#AEB8CE', font: { family: 'Vazirmatn', size: 12 } } }
      }
    }
  });
}

/* ---------- Settings toggle switches (settings.html) ---------- */
function initSwitches(){
  document.querySelectorAll('.switch').forEach(sw=>{
    sw.addEventListener('click', ()=> sw.classList.toggle('on'));
  });
}

/* ---------- Init on load ---------- */
document.addEventListener('DOMContentLoaded', ()=>{
  // Brand must be applied first: it sets the data-brand attribute that
  // drives --accent, and it renders any charts on this page so they
  // pick up the correct color from the very first paint.
  applyBrand(currentBrand());

  renderOrders();
  renderTransactions();
  initSwitches();
  initActionButtons();

  const loginForm = document.getElementById('login-form');
  if(loginForm) loginForm.addEventListener('submit', submitLogin);

  // Apply remembered language last, after all dynamic content (tables,
  // badges, chart legends) has been rendered so it gets translated too.
  applyLanguage(currentLang());
});
