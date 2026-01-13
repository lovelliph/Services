interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  scrollToSection: (id: string) => void;
  onNavigateToApply: () => void;
}

export default function MobileMenu({ isOpen, onClose, scrollToSection, onNavigateToApply }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-40 lg:hidden">
      <div className="flex flex-col items-center justify-center h-full space-y-8">
        <button
          onClick={() => scrollToSection('works')}
          className="text-2xl font-medium text-white hover:text-gray-400 transition-colors"
        >
          WORKS
        </button>
        <button
          onClick={() => scrollToSection('services')}
          className="text-2xl font-medium text-white hover:text-gray-400 transition-colors"
        >
          SERVICES
        </button>
        <button
          onClick={() => scrollToSection('about')}
          className="text-2xl font-medium text-white hover:text-gray-400 transition-colors"
        >
          ABOUT
        </button>
        <button
          onClick={() => scrollToSection('blog')}
          className="text-2xl font-medium text-white hover:text-gray-400 transition-colors"
        >
          BLOG
        </button>
        <button
          onClick={onNavigateToApply}
          className="text-2xl font-medium text-white hover:text-gray-400 transition-colors"
        >
          CAREERS
        </button>
        <button
          onClick={() => scrollToSection('contact')}
          className="bg-white text-black px-8 py-3 text-lg font-medium hover:bg-gray-200 transition-colors"
        >
          GET IN TOUCH
        </button>
      </div>
    </div>
  );
}
