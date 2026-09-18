import React from 'react';
import { ArrowRight } from 'lucide-react';
import { BUSINESS, routes } from '../data/siteSeo';
import { servicePages } from '../data/servicePages';

export function ServicePage({ service, onBookDemo }: { service: keyof typeof servicePages; onBookDemo: (interest: string) => void }) {
  const content = servicePages[service];
  return (
    <article className="max-w-[1180px] mx-auto px-5 py-10 sm:py-14 space-y-10">
      <header className="max-w-3xl">
        <a href={routes.programs.path} className="text-sm font-bold text-[#1769ff] hover:underline">All programs</a>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#10233f] mt-4 mb-5">{content.heading}</h1>
        <p className="text-[#61708a] leading-relaxed">{content.intro}</p>
      </header>
      {content.sections.map(section => (
        <section key={section.title} className="max-w-3xl space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#10233f]">{section.title}</h2>
          {section.paragraphs.map(paragraph => <p key={paragraph} className="text-[#61708a] leading-relaxed">{paragraph}</p>)}
        </section>
      ))}
      <section className="border-t border-[#e6edf7] pt-8 space-y-4">
        <h2 className="text-2xl font-bold text-[#10233f]">Visit Future Minds in Ananth Nagar</h2>
        <p className="text-[#61708a]">{BUSINESS.address}</p>
        <p className="text-[#61708a]">{BUSINESS.hours}</p>
        <button onClick={() => onBookDemo(content.interest)} className="inline-flex items-center gap-2 bg-[#1769ff] text-white px-5 py-3 rounded-xl font-bold hover:bg-[#1258d6]">
          Book a Free Demo <ArrowRight className="w-4 h-4" />
        </button>
        <nav aria-label="Related learning paths" className="flex flex-wrap gap-5 text-sm font-bold text-[#1769ff]">
          <a href={routes.grades.path}>Grades 1-10 curriculum</a>
          <a href={routes.projects.path}>Interactive project lab</a>
          <a href={routes.contact.path}>Campus directions</a>
          {(Object.keys(servicePages) as (keyof typeof servicePages)[]).filter(page => page !== service).map(page => <a key={page} href={routes[page].path}>{servicePages[page].heading}</a>)}
        </nav>
      </section>
    </article>
  );
}