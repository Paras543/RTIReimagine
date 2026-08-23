import { Button } from "@/components/ui/button";
import { FileText, Search, Gavel, FileSearch, History, ArrowRight, Menu, ShieldCheck, AlertTriangle } from "lucide-react";

export default function Home() {
  return (
    <>
      {/* Utility Bar */}
      <div className="bg-surface-container-high py-xs px-margin-mobile md:px-margin-desktop w-full border-b border-outline-variant">
        <div className="max-w-max-width mx-auto flex justify-between items-center font-caption text-caption text-on-surface-variant">
          <div className="flex items-center gap-2">
            <img className="h-4 w-4 object-contain" data-alt="A very tiny emblem of India, rendered in a solid dark gray or navy color, suitable for a minimalist top utility bar. It should be simple, high-contrast, and recognizable as an official seal, set against a transparent background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9CEDKjhx9PkfRYl6NYdCt_XnxAHtU9M9rZhXre46VzsXyUMLtJPdI8KN5YcBiYXrUFW4mlgzGt-1lSXAgNjCnoFkSWgjG2LT2FvTXewx201vGgO6lHdtV34nRCotr3j7t5JjqMeAOlbapZk5hiY9FzH29xV14tvcddk4DcxJtMHhQIJOBSHcUnAkuoEK1USbK4Pmq1V4oEzEhDPefdkEOY4GMiyocIXPbXGZbcR4wuulJ2CpT-Lvq" alt="Emblem" />
            <span className="">Government of India</span>
            <span className="w-[1px] h-3 bg-outline-variant mx-1"></span>
            <div className="flex items-center gap-1">
              <img src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg" className="h-3 w-auto object-contain" alt="Indian Flag" />
              <span className="font-label-md text-[10px] uppercase tracking-tighter opacity-70">Made in India</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-sm">
            <a className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" href="#main-content">Skip to Main Content</a>
            <span className="w-[1px] h-3 bg-outline-variant"></span>
            <a className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" href="#">Accessibility Options</a>
            <span className="w-[1px] h-3 bg-outline-variant"></span>
            <div className="flex gap-1">
              <button className="font-bold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">A</button>
              <button className="text-on-surface-variant hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">A-</button>
              <button className="text-on-surface-variant hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">A+</button>
            </div>
            <span className="w-[1px] h-3 bg-outline-variant"></span>
            <select className="bg-transparent border-none text-caption font-caption text-on-surface-variant py-0 pr-6 pl-2 focus:ring-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Main Header */}
      <header className="bg-surface-container-lowest border-b border-outline-variant py-sm px-margin-mobile md:px-margin-desktop w-full">
        <div className="max-w-max-width mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-gutter">
            <img className="h-16 w-auto object-contain" data-alt="A highly detailed and dignified State Emblem of India (Lion Capital of Ashoka), rendered in deep navy blue (#001f3f) on a pristine white background. The image should convey strong bureaucratic authority, extreme clarity, and vector-like precision, suitable for a national government portal header." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKNgfcj8pGfbImVV9qFRR7dMonANec5PBYViLmUSvnISJaOa80b8OGK-gSkAKIFUnepxJx3wZvwL9YLS8TgOhIrTsu85fmikN_ITgaLprlLfyMYA8cEyu9S4U_Swo7UqGznE3DroPRfTPKtMgRoNXBK8CXKQAFqGBhVddbYnGDhXHdV134e_-2LuIhA886-SaFZH931WR1KHMEvy0VtXOuRxnuysHSANc-uS3-YEflsXOVhkVGMPHn" alt="Emblem of India" />
            <div>
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">RTI Online</h1>
              <p className="font-caption text-caption text-on-surface-variant mt-1">An initiative of Department of Personnel &amp; Training</p>
            </div>
          </div>
          {/* Mobile Menu Toggle */}
          <button aria-label="Toggle Menu" className="md:hidden absolute top-[60px] right-margin-mobile p-2 text-on-surface hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
            <Menu className="h-6 w-6 text-on-surface" />
          </button>
        </div>
      </header>
      
      {/* TopNavBar */}
      <nav className="bg-surface-container-lowest dark:bg-surface-container-lowest font-body-md text-body-md docked full-width top-0 border-b border-outline-variant flat no shadows">
        <div className="flex justify-between items-center px-margin-desktop w-full max-w-max-width mx-auto h-16 overflow-x-auto no-scrollbar md:px-0">
          {/* Navigation Links */}
          <div className="flex items-center gap-md h-full px-margin-mobile md:px-0 min-w-max">
            <a className="text-primary dark:text-primary font-bold border-b-2 border-secondary-container pb-1 h-full flex items-center hover:bg-surface-container-low transition-colors px-2 active:opacity-80 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset" href="#">Home</a>
            <a className="text-on-surface-variant dark:text-on-surface-variant hover:text-primary h-full flex items-center hover:bg-surface-container-low transition-colors px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset" href="#">File RTI</a>
            <a className="text-on-surface-variant dark:text-on-surface-variant hover:text-primary h-full flex items-center hover:bg-surface-container-low transition-colors px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset" href="#">Track Status</a>
            <a className="text-on-surface-variant dark:text-on-surface-variant hover:text-primary h-full flex items-center hover:bg-surface-container-low transition-colors px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset" href="#">My History</a>
            <a className="text-on-surface-variant dark:text-on-surface-variant hover:text-primary h-full flex items-center hover:bg-surface-container-low transition-colors px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset" href="#">FAQ</a>
          </div>
          {/* Trailing Actions */}
          <div className="hidden md:flex items-center gap-sm h-full shrink-0">
            <button className="font-label-md text-label-md text-on-surface hover:text-primary hover:bg-surface-container-low px-4 py-2 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Login/Register</button>
            <button className="bg-secondary-container text-on-secondary-container font-label-md text-label-md px-6 py-2 rounded font-bold hover:brightness-110 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">File New Request</button>
          </div>
        </div>
      </nav>
      
      {/* Main Content Canvas */}
      <main className="flex-grow flex flex-col w-full" id="main-content">
        {/* Hero Section */}
        <section className="relative w-full bg-surface-container py-24 overflow-hidden bg-pattern-gov px-margin-mobile md:px-margin-desktop">
          <div className="max-w-max-width mx-auto relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-7 flex flex-col gap-6 z-20">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="h-5 w-5 text-secondary-container" />
                <span className="font-label-md text-sm text-on-surface-variant font-bold uppercase tracking-widest">Official Portal of Government of India</span>
              </div>
              
              <h2 className="font-display-lg text-[48px] lg:text-[56px] text-primary font-bold leading-[1.1] max-w-2xl tracking-tight">
                Your Right to Information,<br />
                <span className="text-secondary-container">Online.</span>
              </h2>
              
              <p className="font-body-lg text-[18px] text-on-surface-variant max-w-[500px] leading-relaxed mt-2">
                File RTI applications and first appeals with Central Government public authorities securely. Track your application, view responses, and manage your complete RTI history online.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button className="bg-primary text-on-primary font-label-md text-base font-semibold px-6 h-12 rounded hover:bg-primary-container transition-colors flex justify-center items-center gap-2">
                  <FileText className="h-5 w-5" />
                  File an RTI Request
                </Button>
                <Button variant="outline" className="bg-surface-container-lowest border border-outline-variant text-primary font-label-md text-base font-semibold px-6 h-12 rounded hover:bg-surface-container-low transition-colors flex justify-center items-center gap-2">
                  <Search className="h-5 w-5" />
                  Track My Application
                </Button>
              </div>
            </div>
            
            <div className="md:col-span-5 flex justify-center md:justify-end relative z-20">
              <div className="w-full max-w-[420px] bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm">
                <h3 className="font-headline-md text-[22px] text-primary font-bold mb-4">Quick Stats</h3>
                <hr className="border-outline-variant mb-6" />
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <span className="font-display-lg text-[40px] font-bold text-secondary-container mb-1 tracking-tight">2.4M+</span>
                    <span className="font-caption text-[13px] text-on-surface-variant font-medium">Requests Processed</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display-lg text-[40px] font-bold text-primary mb-1 tracking-tight">2,400+</span>
                    <span className="font-caption text-[13px] text-on-surface-variant font-medium">Public Authorities</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Important Notice Banner */}
        <div className="w-full bg-secondary-fixed-dim text-on-secondary-fixed border-y border-outline-variant py-sm px-margin-mobile md:px-margin-desktop">
          <div className="max-w-max-width mx-auto flex items-start sm:items-center gap-sm font-body-md text-body-md">
            <AlertTriangle className="h-5 w-5 text-secondary shrink-0 mt-0.5 sm:mt-0" />
            <p className=""><strong>Important:</strong> This portal is for filing RTI requests with <strong>Central Government</strong> authorities only. Requests intended for State Governments must be filed through their respective state portals.</p>
          </div>
        </div>
        
        {/* Section Spacing */}
        <div className="w-full bg-background py-lg px-margin-mobile md:px-margin-desktop">
          <div className="max-w-max-width mx-auto">
            {/* Quick Actions (Bento Grid Style) */}
            <div className="mb-xl">
              <h3 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-lg">What would you like to do?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
                {/* Action Card 1 */}
                <a className="group bg-surface-container-lowest border border-outline-variant rounded-lg p-md hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all duration-200 hover:shadow-[0_4px_6px_-1px_rgba(18,53,91,0.05)] hover:-translate-y-1 relative overflow-hidden flex flex-col h-full" href="#">
                  <div className="h-1 w-full bg-primary absolute top-0 left-0"></div>
                  <div className="h-12 w-12 rounded-full bg-primary-fixed flex items-center justify-center mb-4 text-on-primary-fixed group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h4 className="font-headline-md text-headline-md text-on-surface mb-2">File an RTI</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant flex-grow">Submit a new Right to Information request to a Central Government Ministry or Department.</p>
                  <div className="mt-4 flex items-center text-primary font-label-md text-label-md group-hover:translate-x-1 transition-transform">
                    Start application <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </a>
                
                {/* Action Card 2 */}
                <a className="group bg-surface-container-lowest border border-outline-variant rounded-lg p-md hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all duration-200 hover:shadow-[0_4px_6px_-1px_rgba(18,53,91,0.05)] hover:-translate-y-1 relative overflow-hidden flex flex-col h-full" href="#">
                  <div className="h-12 w-12 rounded-full bg-surface-container-highest flex items-center justify-center mb-4 text-on-surface-variant group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <Gavel className="h-6 w-6" />
                  </div>
                  <h4 className="font-headline-md text-headline-md text-on-surface mb-2">File First Appeal</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant flex-grow">Appeal a decision or report a delayed response from a previous RTI request.</p>
                  <div className="mt-4 flex items-center text-primary font-label-md text-label-md group-hover:translate-x-1 transition-transform">
                    Submit appeal <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </a>
                
                {/* Action Card 3 */}
                <a className="group bg-surface-container-lowest border border-outline-variant rounded-lg p-md hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all duration-200 hover:shadow-[0_4px_6px_-1px_rgba(18,53,91,0.05)] hover:-translate-y-1 relative overflow-hidden flex flex-col h-full" href="#">
                  <div className="h-12 w-12 rounded-full bg-surface-container-highest flex items-center justify-center mb-4 text-on-surface-variant group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <FileSearch className="h-6 w-6" />
                  </div>
                  <h4 className="font-headline-md text-headline-md text-on-surface mb-2">Track Application</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant flex-grow">Check the current status and view responses for your submitted RTI applications.</p>
                  <div className="mt-4 flex items-center text-primary font-label-md text-label-md group-hover:translate-x-1 transition-transform">
                    Check status <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </a>
                
                {/* Action Card 4 */}
                <a className="group bg-surface-container-lowest border border-outline-variant rounded-lg p-md hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all duration-200 hover:shadow-[0_4px_6px_-1px_rgba(18,53,91,0.05)] hover:-translate-y-1 relative overflow-hidden flex flex-col h-full" href="#">
                  <div className="h-12 w-12 rounded-full bg-surface-container-highest flex items-center justify-center mb-4 text-on-surface-variant group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <History className="h-6 w-6" />
                  </div>
                  <h4 className="font-headline-md text-headline-md text-on-surface mb-2">View History</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant flex-grow">Access your complete archive of past RTI requests, appeals, and official responses.</p>
                  <div className="mt-4 flex items-center text-primary font-label-md text-label-md group-hover:translate-x-1 transition-transform">
                    Go to dashboard <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </a>
              </div>
            </div>
            
            {/* Process Timeline */}
            <div className="mb-xl bg-surface-container-lowest border border-outline-variant rounded-lg p-lg hover:shadow-md transition-shadow duration-500 cursor-default">
              <h3 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-lg text-center">How RTI Online Works</h3>
              <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center mt-8">
                {/* Horizontal Line (Desktop) */}
                <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-[2px] bg-surface-container-highest z-0 overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-full bg-primary origin-left animate-timeline-line-h"></div>
                </div>
                {/* Vertical Line (Mobile) */}
                <div className="md:hidden absolute top-0 bottom-0 left-6 w-[2px] bg-surface-container-highest z-0 overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-full bg-primary origin-top animate-timeline-line-v"></div>
                </div>
                
                {/* Step 1 */}
                <div className="relative z-10 flex flex-row md:flex-col items-center gap-md md:gap-sm md:text-center w-full md:w-1/4 mb-8 md:mb-0 group/step">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-headline-md shrink-0 border-2 transition-all duration-500 animate-step-1">1</div>
                  <div>
                    <h4 className="font-headline-md text-body-lg text-on-surface font-bold">Choose Authority</h4>
                    <p className="font-body-md text-caption text-on-surface-variant mt-1">Select the correct Central Ministry or Department.</p>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div className="relative z-10 flex flex-row md:flex-col items-center gap-md md:gap-sm md:text-center w-full md:w-1/4 mb-8 md:mb-0 group/step">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-headline-md shrink-0 border-2 transition-all duration-500 animate-step-2">2</div>
                  <div>
                    <h4 className="font-headline-md text-body-lg text-on-surface font-bold">Write Request</h4>
                    <p className="font-body-md text-caption text-on-surface-variant mt-1">Clearly state the information you are seeking.</p>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="relative z-10 flex flex-row md:flex-col items-center gap-md md:gap-sm md:text-center w-full md:w-1/4 mb-8 md:mb-0 group/step">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-headline-md shrink-0 border-2 transition-all duration-500 animate-step-3">3</div>
                  <div>
                    <h4 className="font-headline-md text-body-lg text-on-surface font-bold">Pay Fee</h4>
                    <p className="font-body-md text-caption text-on-surface-variant mt-1">Pay the standard ₹10 fee securely online.</p>
                  </div>
                </div>
                
                {/* Step 4 */}
                <div className="relative z-10 flex flex-row md:flex-col items-center gap-md md:gap-sm md:text-center w-full md:w-1/4 group/step">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-headline-md shrink-0 border-2 transition-all duration-500 animate-step-4">4</div>
                  <div>
                    <h4 className="font-headline-md text-body-lg text-on-surface font-bold">Track Status</h4>
                    <p className="font-body-md text-caption text-on-surface-variant mt-1">Monitor progress and receive official replies.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Directory Search */}
            <div className="mb-lg">
              <div className="bg-primary-container rounded-lg p-lg flex flex-col md:flex-row items-center justify-between gap-lg">
                <div className="w-full md:w-1/2">
                  <h3 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-primary mb-2">Find a Public Authority</h3>
                  <p className="font-body-md text-body-md text-inverse-primary">Search our comprehensive directory of Central Government Ministries, Departments, and attached offices to direct your RTI query correctly.</p>
                </div>
                <div className="w-full md:w-1/2 flex flex-col gap-sm">
                  <div className="relative w-full">
                    <Search className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-outline-variant" />
                    <input className="w-full pl-12 pr-4 py-3 rounded border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:ring-2 focus:ring-secondary-container focus:border-secondary-container outline-none transition-all h-[48px]" placeholder="Search by Ministry, Department, or keyword..." type="text" />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span className="font-caption text-caption text-inverse-primary mr-2 self-center">Popular filters:</span>
                    <button className="px-3 py-1 bg-surface-tint bg-opacity-20 text-on-primary rounded-full font-caption text-caption hover:bg-opacity-40 transition-colors border border-surface-tint">Finance</button>
                    <button className="px-3 py-1 bg-surface-tint bg-opacity-20 text-on-primary rounded-full font-caption text-caption hover:bg-opacity-40 transition-colors border border-surface-tint">Railways</button>
                    <button className="px-3 py-1 bg-surface-tint bg-opacity-20 text-on-primary rounded-full font-caption text-caption hover:bg-opacity-40 transition-colors border border-surface-tint">Home Affairs</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-primary dark:bg-primary-container text-on-primary dark:text-on-primary-container font-caption text-caption full-width bottom-0 bg-primary dark:bg-primary-container flat no shadows mt-auto border-t-[8px] border-secondary-container">
        <div className="w-full py-md px-margin-desktop flex flex-col md:flex-row justify-between items-center max-w-max-width mx-auto gap-md md:gap-0 px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-col items-center md:items-start gap-sm">
            <span className="font-label-md text-label-md font-bold text-on-primary">RTI Online</span>
            <p className="text-on-primary dark:text-on-primary-container opacity-80 hover:opacity-100 transition-opacity">© 2024 RTI Online. Designed and Developed by National Informatics Centre (NIC).</p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-md">
            <a className="text-on-primary dark:text-on-primary-container opacity-80 hover:opacity-100 hover:text-secondary-fixed cursor-pointer transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-fixed focus-visible:ring-offset-2 focus-visible:ring-offset-primary" href="#">Privacy Policy</a>
            <a className="text-on-primary dark:text-on-primary-container opacity-80 hover:opacity-100 hover:text-secondary-fixed cursor-pointer transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-fixed focus-visible:ring-offset-2 focus-visible:ring-offset-primary" href="#">Terms of Service</a>
            <a className="text-on-primary dark:text-on-primary-container opacity-80 hover:opacity-100 hover:text-secondary-fixed cursor-pointer transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-fixed focus-visible:ring-offset-2 focus-visible:ring-offset-primary" href="#">Contact Us</a>
            <a className="text-on-primary dark:text-on-primary-container opacity-80 hover:opacity-100 hover:text-secondary-fixed cursor-pointer transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-fixed focus-visible:ring-offset-2 focus-visible:ring-offset-primary" href="#">Help Desk</a>
            <a className="text-on-primary dark:text-on-primary-container opacity-80 hover:opacity-100 hover:text-secondary-fixed cursor-pointer transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-fixed focus-visible:ring-offset-2 focus-visible:ring-offset-primary" href="#">Accessibility Statement</a>
          </div>
        </div>
      </footer>
    </>
  );
}
