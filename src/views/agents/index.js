/**
 * View — Agents & Harness
 * Agent chat interface (iMessage / Apple Intelligence style).
 * Mock data only — no real AI backend.
 */

import { i18n } from '../../utils/i18n.js';
import { agents, messages } from '../../data/mockAgents.js';

let selectedAgentId = null;

/**
 * Render the Agents view into the outlet element
 * @param {HTMLElement} outlet - Container element
 */
export default function render(outlet) {
  const isFa = i18n.locale === 'fa';

  outlet.innerHTML = `
    <section class="agents">
      <div class="agents__header">
        <h1 class="dashboard__title">${i18n.t('agents_title', 'Agents')}</h1>
      </div>

      <!-- Agent List + Chat Split -->
      <div class="agents__split">
        <!-- Agent List -->
        <div class="agents__list">
          <div class="agents__list-header">
            <button class="btn btn--ghost btn--sm" id="agents-new-chat" style="width: 100%; justify-content: flex-start; padding: var(--ios27-space-sm) var(--ios27-space-md);">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              ${i18n.t('agents_new_chat', 'New Chat')}
            </button>
          </div>
          <div class="agents__agent-list">
            ${renderAgentList(agents)}
          </div>
        </div>

        <!-- Chat View -->
        <div class="agents__chat" id="agents-chat-view" class="hidden">
          <div class="agents__chat-header">
            <div class="agents__chat-avatar" id="agents-chat-avatar">AA</div>
            <h2 class="agents__chat-title" id="agents-chat-title">${i18n.t('agents_select_agent', 'Select an agent')}</h2>
            <span class="agents__chat-status" id="agents-chat-status">—</span>
          </div>
          <div class="chat__container">
            <div class="chat__messages" id="agents-chat-messages"></div>
          </div>
          <div class="chat__input-area">
            <div class="chat__input-wrapper">
              <textarea id="agents-message-input" class="chat__input" placeholder="${i18n.t('agents_message_placeholder', 'Type a message...')}" rows="1"></textarea>
              <button class="chat__send-btn" id="agents-send-btn" disabled>
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 22 2 9 2 22 2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty state when no agent selected -->
        <div id="agents-empty-state" class="agents__empty">
          <div class="empty-state">
            <div class="empty-state__icon">🤖</div>
            <h2 class="empty-state__title">${i18n.t('agents_select_agent', 'Select an agent')}</h2>
            <p class="empty-state__subtitle">${i18n.t('agents_no_agents', 'No agents available.')}</p>
          </div>
        </div>
      </div>
    </section>
  `;

  _attachAgentsListeners(outlet);
}

/**
 * Render agent list items
 */
function renderAgentList(agentList) {
  const isFa = i18n.locale === 'fa';

  if (agentList.length === 0) return '';

  return agentList.map((agent) => `
    <div class="agent-card" data-agent-id="${agent.id}">
      <div class="agent-card__header">
        <div class="avatar" style="background: ${agent.color}; width: 36px; height: 36px; font-size: var(--ios27-text-caption1);">
          ${agent.avatar}
        </div>
        <div>
          <div class="agent-card__title">${isFa ? agent.name : agent.nameEn}</div>
          <span class="agent-card__status">${agent.status === 'online' ? (isFa ? 'آنلاین' : 'Online') : agent.status === 'busy' ? (isFa ? 'Bizy' : 'Busy') : (isFa ? 'آفلاین' : 'Offline')}</span>
        </div>
      </div>
      <div class="agent-card__description">
        ${isFa ? agent.description : agent.descriptionEn}
      </div>
    </div>
  `).join('');
}

/**
 * Attach event listeners
 */
function _attachAgentsListeners(outlet) {
  // New chat
  const newChatBtn = outlet.querySelector('#agents-new-chat');
  if (newChatBtn) {
    newChatBtn.addEventListener('click', () => {
      // Select first agent or create mock conversation
      if (agents.length > 0) {
        _selectAgent(agents[0].id, outlet);
      }
    });
  }

  // Agent card click
  outlet.addEventListener('click', (e) => {
    const agentCard = e.target.closest('.agent-card');
    if (agentCard) {
      const agentId = agentCard.getAttribute('data-agent-id');
      _selectAgent(agentId, outlet);
      return;
    }
  });

  // Send button
  const sendBtn = document.getElementById('agents-send-btn');
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      _sendMessage(outlet);
    });
  }

  // Input: auto-resize + enable send
  const input = document.getElementById('agents-message-input');
  if (input) {
    input.addEventListener('input', (e) => {
      e.target.style.height = 'auto';
      e.target.style.height = `${e.target.scrollHeight}px`;
      sendBtn.disabled = !e.target.value.trim();
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        _sendMessage(outlet);
      }
    });
  }
}

/**
 * Select an agent and load chat
 */
function _selectAgent(agentId, outlet) {
  selectedAgentId = agentId;
  const agent = agents.find((a) => a.id === agentId);
  if (!agent) return;

  const isFa = i18n.locale === 'fa';

  // Update UI
  document.getElementById('agents-chat-title').textContent = isFa ? agent.name : agent.nameEn;
  document.getElementById('agents-chat-avatar').textContent = agent.avatar;
  document.getElementById('agents-chat-avatar').style.background = agent.color;
  document.getElementById('agents-chat-status').textContent = agent.status === 'online' ? (isFa ? 'آنلاین' : 'Online') : agent.status === 'busy' ? (isFa ? 'Busy' : 'Busy') : (isFa ? 'آفلاین' : 'Offline');

  // Show chat view, hide empty state
  document.getElementById('agents-empty-state').classList.add('hidden');
  document.getElementById('agents-chat-view').classList.remove('hidden');

  // Render messages
  _renderMessages(agentId);
}

/**
 * Render messages for selected agent
 */
function _renderMessages(agentId) {
  const msgContainer = document.getElementById('agents-chat-messages');
  if (!msgContainer) return;

  const agentMsgs = messages[agentId] || [];
  const isFa = i18n.locale === 'fa';

  msgContainer.innerHTML = agentMsgs.map((msg) => `
    <div class="chat__message chat__message--${msg.sender}">
      <div class="chat__message__bubble">
        ${isFa ? msg.text : msg.textEn}
      </div>
    </div>
  `).join('');

  msgContainer.scrollTop = msgContainer.scrollHeight;
}

/**
 * Send a message
 */
function _sendMessage(outlet) {
  const input = document.getElementById('agents-message-input');
  const sendBtn = document.getElementById('agents-send-btn');
  const text = input.value.trim();
  if (!text || !selectedAgentId) return;

  const isFa = i18n.locale === 'fa';

  // Add user message
  const userMsg = {
    id: Date.now().toString(),
    sender: 'user',
    text,
    textEn: text,
    timestamp: new Date().toISOString(),
  };

  _appendMessage(userMsg);
  input.value = '';
  input.style.height = 'auto';
  sendBtn.disabled = true;

  // Mock agent response after delay
  setTimeout(() => {
    const agent = agents.find((a) => a.id === selectedAgentId);
    const responses = isFa
      ? ['در حال بررسی درخواست شما...', 'چگونه می‌توانم بیشتر کمک کنم؟', 'این اطلاعات را برایتان آماده کردم.']
      : ['Processing your request...', 'How else can I help?', 'I have prepared this information for you.'];

    const agentMsg = {
      id: (Date.now() + 1).toString(),
      sender: 'agent',
      text: responses[Math.floor(Math.random() * responses.length)],
      textEn: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date().toISOString(),
    };

    _appendMessage(agentMsg);
  }, 1200);
}

/**
 * Append a message to the chat
 */
function _appendMessage(msg) {
  const msgContainer = document.getElementById('agents-chat-messages');
  if (!msgContainer) return;

  const isFa = i18n.locale === 'fa';

  const el = document.createElement('div');
  el.className = `chat__message chat__message--${msg.sender}`;
  el.innerHTML = `<div class="chat__message__bubble">${isFa ? msg.text : msg.textEn}</div>`;
  msgContainer.appendChild(el);
  msgContainer.scrollTop = msgContainer.scrollHeight;
}
