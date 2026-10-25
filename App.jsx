import React, { useState, useEffect } from 'react';
import {
  INITIAL_BOOKS,
  INITIAL_MEMBERS,
  INITIAL_ISSUES
} from './data/libraryData.js';
import LoadingScreen from './components/LoadingScreen.jsx';
import LoginPage from './components/LoginPage.jsx';
import Navbar from './components/Navbar.jsx';
import LandingPage from './components/LandingPage.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import BooksSection from './components/BooksSection.jsx';
import MembersSection from './components/MembersSection.jsx';
import FineCalculatorSection from './components/FineCalculatorSection.jsx';
import AboutPage from './components/AboutPage.jsx';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isOpeningLibrary, setIsOpeningLibrary] = useState(false);
  const [openingProgress, setOpeningProgress] = useState(0);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState('landing');
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [issues, setIssues] = useState(INITIAL_ISSUES);
  const [fineRate, setFineRate] = useState(15);

  useEffect(() => {
    if (!isLoading) return undefined;
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 140);
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    if (!isOpeningLibrary) return undefined;
    const interval = setInterval(() => {
      setOpeningProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsOpeningLibrary(false);
          setIsAdminLoggedIn(true);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [isOpeningLibrary]);

  useEffect(() => {
    const syncFromHash = () => {
      const raw = window.location.hash.replace('#/', '').replace('#', '');
      const validPages = [
        'landing',
        'dashboard',
        'books',
        'members',
        'fines',
        'about'
      ];
      if (validPages.includes(raw)) {
        setActivePage(raw);
      }
    };
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  const navigateTo = (page) => {
    setActivePage(page);
    try {
      window.location.hash = `/${page}`;
    } catch {
      // Ignore hash restrictions in sandboxed environments
    }
  };

  const handleAddMember = (name, branch) => {
    const nextNum = 101 + members.length;
    const newMember = {
      id: `SB-${nextNum}`,
      name,
      branch,
      joined: '2026-10-25',
      role: 'Student Member'
    };
    setMembers((prev) => [newMember, ...prev]);
  };

  const handleDeleteMember = (id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const handleAddBook = ({ title, author, category, synopsis }) => {
    const nextNum = 101 + books.length;
    const newBook = {
      id: `BK-${nextNum}`,
      title,
      author,
      category,
      isbn: `978-01430${nextNum}`,
      shelf: 'Rack A3 - Shelf 1',
      copies: 4,
      available: 4,
      rating: 4.8,
      synopsis
    };
    setBooks((prev) => [newBook, ...prev]);
  };

  const handleIssueBook = (bookId, memberId, daysHeld = 1) => {
    const book = books.find((b) => b.id === bookId);
    const member = members.find((m) => m.id === memberId);
    if (!book || !member) return;

    const newIssue = {
      id: `ISS-${901 + issues.length}`,
      bookId: book.id,
      bookTitle: book.title,
      memberId: member.id,
      memberName: member.name,
      branch: member.branch,
      issueDate: '2026-10-25',
      daysHeld,
      returned: false
    };
    setIssues((prev) => [newIssue, ...prev]);
  };

  const handleUpdateDaysHeld = (issueId, newDays) => {
    setIssues((prev) =>
      prev.map((item) =>
        item.id === issueId ? { ...item, daysHeld: newDays } : item
      )
    );
  };

  const handleToggleReturn = (issueId) => {
    setIssues((prev) =>
      prev.map((item) =>
        item.id === issueId ? { ...item, returned: !item.returned } : item
      )
    );
  };

  if (isLoading) {
    return (
      <LoadingScreen
        progress={loadingProgress}
        onSkip={() => setIsLoading(false)}
        title="Loading Library Portal..."
        subtitle="Preparing sign-in gateway"
        buttonLabel="Continue to Sign In"
      />
    );
  }

  if (isOpeningLibrary) {
    return (
      <LoadingScreen
        progress={openingProgress}
        onSkip={() => {
          setIsOpeningLibrary(false);
          setIsAdminLoggedIn(true);
          navigateTo('landing');
        }}
        title="Opening Your Library..."
        subtitle="Sign-in verified • Loading books, members, and fine system"
        buttonLabel="Skip Loading"
      />
    );
  }

  if (!isAdminLoggedIn) {
    return (
      <LoginPage
        onLoginSuccess={() => {
          setOpeningProgress(0);
          setIsOpeningLibrary(true);
          navigateTo('landing');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5EFE6] text-slate-800 font-sans selection:bg-pink-200 selection:text-slate-900">
      <Navbar
        activePage={activePage}
        navigateTo={navigateTo}
        onLogout={() => {
          setIsAdminLoggedIn(false);
        }}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activePage === 'landing' && (
          <LandingPage
            books={books}
            members={members}
            issues={issues}
            fineRate={fineRate}
            navigateTo={navigateTo}
          />
        )}

        {activePage === 'dashboard' && (
          <AdminDashboard
            books={books}
            members={members}
            issues={issues}
            fineRate={fineRate}
            navigateTo={navigateTo}
          />
        )}

        {activePage === 'books' && (
          <BooksSection
            books={books}
            members={members}
            onAddBook={handleAddBook}
            onIssueBook={handleIssueBook}
          />
        )}

        {activePage === 'members' && (
          <MembersSection
            members={members}
            issues={issues}
            onAddMember={handleAddMember}
            onDeleteMember={handleDeleteMember}
          />
        )}

        {activePage === 'fines' && (
          <FineCalculatorSection
            issues={issues}
            books={books}
            members={members}
            fineRate={fineRate}
            setFineRate={setFineRate}
            onUpdateDaysHeld={handleUpdateDaysHeld}
            onToggleReturn={handleToggleReturn}
            onIssueBook={handleIssueBook}
          />
        )}

        {activePage === 'about' && <AboutPage navigateTo={navigateTo} />}
      </main>

      <footer className="border-t border-sky-200 bg-[#FDFBF7] py-6 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">Team Side Burn</span>
            <span>•</span>
            <span>
              Raghav Sharma (Lead), Ishan Sharma, Rajat Gupta, Aradhya Singh Chauhan
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigateTo('landing')}
              className="hover:text-sky-700 font-medium"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => navigateTo('books')}
              className="hover:text-sky-700 font-medium"
            >
              Catalog & Dice
            </button>
            <button
              type="button"
              onClick={() => navigateTo('fines')}
              className="hover:text-sky-700 font-medium"
            >
              Fine System
            </button>
            <button
              type="button"
              onClick={() => navigateTo('about')}
              className="hover:text-pink-700 font-semibold"
            >
              About Page
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
