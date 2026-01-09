// GitHub Stats Dashboard

const USERNAME = 'royboker';
const API_BASE = 'https://api.github.com';
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

class GitHubDashboard {
  constructor() {
    this.languageColors = {
      'Python': '#3572A5',
      'Java': '#b07219',
      'JavaScript': '#f1e05a',
      'C#': '#178600',
      'HTML': '#e34c26',
      'CSS': '#563d7c',
      'Jupyter Notebook': '#DA5B0B',
      'TypeScript': '#2b7489',
      'C++': '#f34b7d',
      'C': '#555555',
      'Shell': '#89e051',
      'Ruby': '#701516',
      'Go': '#00ADD8',
      'Rust': '#dea584',
      'Kotlin': '#A97BFF'
    };

    this.init();
  }

  async init() {
    try {
      const [user, repos] = await Promise.all([
        this.fetchWithCache(`${API_BASE}/users/${USERNAME}`, 'github-user'),
        this.fetchWithCache(`${API_BASE}/users/${USERNAME}/repos?sort=updated&per_page=100`, 'github-repos')
      ]);

      this.renderProfile(user);
      this.renderTopRepos(repos);
      this.renderAllRepos(repos);
      await this.renderLanguagesChart(repos);
    } catch (error) {
      console.error('Error fetching GitHub data:', error);
      this.showError();
    }

    this.initNavigation();
  }

  async fetchWithCache(url, cacheKey) {
    // Check cache
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    }

    // Fetch fresh data
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Cache the data
    localStorage.setItem(cacheKey, JSON.stringify({
      data,
      timestamp: Date.now()
    }));

    return data;
  }

  renderProfile(user) {
    const profileCard = document.getElementById('profile-card');
    const loading = profileCard.querySelector('.profile-loading');
    const content = profileCard.querySelector('.profile-content');

    document.getElementById('avatar').src = user.avatar_url;
    document.getElementById('name').textContent = user.name || user.login;
    document.getElementById('bio').textContent = user.bio || 'Software Engineering Student';
    document.getElementById('public-repos').textContent = user.public_repos;
    document.getElementById('followers').textContent = user.followers;
    document.getElementById('following').textContent = user.following;
    document.getElementById('github-link').href = user.html_url;

    loading.style.display = 'none';
    content.style.display = 'flex';
  }

  renderTopRepos(repos) {
    const reposList = document.getElementById('repos-list');

    // Sort by stars, then by recent update
    const topRepos = [...repos]
      .sort((a, b) => (b.stargazers_count - a.stargazers_count) || new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 5);

    reposList.innerHTML = topRepos.map(repo => `
      <div class="repo-item">
        <span class="repo-icon">📁</span>
        <div class="repo-info">
          <a href="${repo.html_url}" target="_blank" class="repo-name">${repo.name}</a>
          <span class="repo-language">
            ${repo.language ? `<span class="lang-dot ${this.getLangClass(repo.language)}"></span> ${repo.language}` : 'No language'}
          </span>
        </div>
        <span class="repo-stars">⭐ ${repo.stargazers_count}</span>
      </div>
    `).join('');
  }

  renderAllRepos(repos) {
    const allReposEl = document.getElementById('all-repos');

    const sortedRepos = [...repos].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    allReposEl.innerHTML = sortedRepos.map(repo => `
      <div class="repo-card">
        <div class="repo-card-header">
          <span class="repo-card-icon">📂</span>
          <a href="${repo.html_url}" target="_blank" class="repo-card-name">${repo.name}</a>
        </div>
        <p class="repo-card-desc">${repo.description || 'No description available'}</p>
        <div class="repo-card-meta">
          ${repo.language ? `
            <span>
              <span class="lang-dot ${this.getLangClass(repo.language)}"></span>
              ${repo.language}
            </span>
          ` : ''}
          <span>⭐ ${repo.stargazers_count}</span>
          <span>🔀 ${repo.forks_count}</span>
          <span>📅 ${this.formatDate(repo.updated_at)}</span>
        </div>
      </div>
    `).join('');
  }

  async renderLanguagesChart(repos) {
    // Aggregate languages from all repos
    const languageCounts = {};

    repos.forEach(repo => {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      }
    });

    // Sort by count and take top 8
    const sortedLanguages = Object.entries(languageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    const labels = sortedLanguages.map(([lang]) => lang);
    const data = sortedLanguages.map(([, count]) => count);
    const colors = sortedLanguages.map(([lang]) => this.languageColors[lang] || '#888888');

    const ctx = document.getElementById('languages-chart').getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              usePointStyle: true,
              font: {
                size: 12
              }
            }
          }
        }
      }
    });
  }

  getLangClass(language) {
    const langMap = {
      'Python': 'python',
      'Java': 'java',
      'JavaScript': 'javascript',
      'C#': 'csharp',
      'HTML': 'html',
      'CSS': 'css',
      'Jupyter Notebook': 'jupyter'
    };
    return langMap[language] || 'default';
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }

  showError() {
    const profileCard = document.getElementById('profile-card');
    profileCard.innerHTML = `
      <div class="card-body text-center">
        <p style="color: var(--color-error);">Unable to load GitHub data. Please try again later.</p>
        <button class="btn btn-primary btn-sm" onclick="location.reload()">Retry</button>
      </div>
    `;
  }

  initNavigation() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');

    if (mobileMenuBtn && mobileNav) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        mobileNav.classList.toggle('active');
      });
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new GitHubDashboard();
});
