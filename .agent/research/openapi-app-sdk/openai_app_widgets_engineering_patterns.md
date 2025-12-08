# OpenAI App Widgets: Engineering & Application Patterns

This document focuses on **how to implement** OpenAI App widgets using the Apps SDK with robust engineering patterns and solid UX, rather than just describing features.

---

## 1. Mental Model & High-Level Architecture

### 1.1 Core mental model

An OpenAI App widget is:

- A **small web app** (HTML/JS/CSS) running in an isolated iframe inside ChatGPT.
- Fed by your **tools** (MCP server) via `structuredContent` and metadata.
- Able to **call tools back** (via `window.openai.callTool`) and **expose state** to the model (via widget state and structured outputs).

Think of it as a three-part system:

1. **Model layer (ChatGPT):**
   - Decides when to call your tools.
   - Sees the tools’ structured outputs and `widgetState`.
   - Drives conversation.

2. **Tool layer (App backend / MCP server):**
   - Implements business logic and external API calls.
   - Returns:
     - `content`: human-readable text.
     - `structuredContent`: typed data for the widget and the model.
     - `_meta.openai/outputTemplate`: which widget resource to render and how.

3. **Widget layer (Frontend in iframe):**
   - Renders `structuredContent` via DOM/React/etc.
   - Reacts to model/tool updates using the Apps SDK bridge (`window.openai`).
   - Calls tools directly to fetch/modify data.

**Key pattern:**  
Design your app so that **ChatGPT + tools + widget** together form one system:

- ChatGPT handles language, reasoning and intent routing.
- Tools handle business/domain logic.
- The widget handles **visualization and direct manipulation** of structured data.

---

## 2. Widget Lifecycle: Single vs Multiple Widgets

### 2.1 Canonical pattern: a persistent widget that updates

In most serious apps, you want **one widget per “session” or task** that:

1. Is created by an initial tool call that:
   - Returns the first `structuredContent`.
   - Declares an `outputTemplate` that points at your widget.

2. Then **stays alive** and:
   - Updates its UI as new tool outputs arrive.
   - Drives further tool calls via `window.openai.callTool`.
   - Uses widget state to keep context.

This avoids spammy UX like:

> User does one action → model calls a tool → new widget message.  
> User does another action → another new widget message, etc.

Instead, you get:

> One widget card (or fullscreen / PiP) that lives across multiple interactions and keeps updating.

### 2.2 When multiple widgets are acceptable

Multiple widget instances can still be right in some cases:

- Each instance is a **standalone artifact**:
  - e.g. “Generate a chart of these metrics” → one card per chart.
  - e.g. Multiple independent results (search result A, search result B) where each card is self-contained.

- New user question with **totally new context**:
  - Different query, different dataset, different workflow.

### 2.3 Engineering patterns to keep a single widget alive

**Pattern: “Widget session”**

- Introduce a `session_id` concept at your backend level.
- The first tool call:
  - Allocates a `session_id`.
  - Returns it in `structuredContent` (and optionally widget state).
- All subsequent tool calls from the widget:
  - Send that `session_id`.
  - Backend uses it to attach state, data, etc., to that logical session.

Example structured content (pseudo):

```json
{
  "session_id": "abc123",
  "view": {
    "step": "results",
    "items": [...]
  }
}
```

In your widget:

- On first render, read `session_id` from `window.openai.toolOutput`.
- Cache it in widget state, so subsequent tool calls include it.

**Pattern: “Widget-owned interaction loop”**

- After initial creation, avoid having the **user ask ChatGPT** “now filter by X” and letting the model call your tool again.
- Instead:
  - Provide UI controls (buttons, filters, tabs), each calling a tool via `window.openai.callTool`.
  - The widget updates in place when results arrive.

This pattern:

- Preserves conversational context for high-level intent.
- Uses the widget only for **specific, high-bandwidth interactions** (filtering, selection, paging, etc.).

---

## 3. Display Modes as Architectural Choices

There are three primary display modes:

- **Inline card**
- **Fullscreen**
- **Picture-in-Picture (PiP)**

Use them as **different “shells”** around the same core widget logic.

### 3.1 Inline card – default and most common

**Use inline when:**

- Single-shot or low-complexity interactions:
  - Presenting results.
  - Offering a small choice.
  - Showing summary visualizations.
- The UX can be fully understood in a **phone-sized**, non-scrollable card.

**Engineering patterns:**

- Keep DOM tree shallow and simple: list, table, small form, or a single visualization.
- Limit actions:
  - 0–2 primary buttons.
  - Possibly a link-like control (“View details”, “Open fullscreen”).
- Avoid scroll containers inside the widget:
  - Let ChatGPT handle scroll.
  - If content may overflow, add:
    - A “Show N more” pattern.
    - Or a “Expand to fullscreen” button.

**Good inline patterns:**

- “Result card” pattern:
  - Title.
  - Key metrics or list.
  - Minimal CTA (e.g. “Open in fullscreen”, “Run again with different parameters”).

- “Choice card” pattern:
  - Show concrete choices as buttons (“Option A”, “Option B”).
  - When clicked, call a tool and update the same inline widget (if the new state is small), or open fullscreen.

### 3.2 Fullscreen – deep interaction shell

**Use fullscreen when:**

- You have a **multi-step** or **high-density** flow:
  - Complex forms.
  - Data exploration table.
  - Map, diagram, or full-page visualization.
- The interaction feels like a “mini-app” embedded in the conversation.

**Engineering patterns:**

- Architect the widget UI so it can render in both inline and fullscreen:
  - Inline: a summary view.
  - Fullscreen: full editor / explorer.

You can achieve this by:

- Having a root `<App mode="inline" />` or `<App mode="fullscreen" />`.
- The widget calls `window.openai.requestDisplayMode({ mode: "fullscreen" })` when user presses “Expand”.

Make sure:

- Fullscreen view **still respects the conversation**:
  - Avoid replicating a full landing page.
  - Show relevant context (e.g. what we’re editing).
  - Provide obvious “Done” / “Close” actions to collapse back.

### 3.3 Picture-in-Picture – persistent overlay

**Use PiP when:**

- The app represents an **ongoing process** alongside the conversation:
  - A game that continues across messages.
  - A live dashboard (stocks, monitoring, timers).
  - A “coach” view (e.g. progress tracker).

**Engineering patterns:**

- PiP widgets need:
  - A small, information-dense layout.
  - Very limited controls.
  - Strong state synchronization with the backend.

- Use PiP as “HUD”:
  - Show just the essentials: key numerical metrics, status indicator, maybe one main action.
  - If the user needs detail, provide an action to open fullscreen.

- State synchronization pattern:
  - The widget subscribes to `toolOutput` changes.
  - Backend tools update the shared session state.
  - PiP re-renders minimal but accurate info.

**Implementation flow example:**

1. Inline card appears with “Start game” button.
2. User clicks → tool call creates game session and returns `session_id` and initial game state.
3. Widget requests PiP mode and renders scoreboard.
4. Scoreboard stays visible while:
   - User chats with ChatGPT (model might call tools).
   - Tools update score; widget sees new tool outputs and re-renders.

---

## 4. State Management Patterns

There are three main state locations:

1. **Backend/session state** – single source of truth for business logic.
2. **Widget state** – ephemeral, per-widget UI state accessible to the model.
3. **Local UI-only state** – purely visual, not visible to model or backend.

### 4.1 Backend as the single source of truth

**Pattern: “Thin widget, fat backend”**

- Business rules (permissions, invariants, price calculations, validation rules) belong in the backend tools.
- The widget:
  - Collects user input.
  - Calls tools.
  - Renders results.

Benefits:

- Deterministic behavior independent of client (web or mobile).
- Easier to test.
- Fewer edge cases when the user interacts via conversation instead of the widget.

### 4.2 Widget state for model-visible UI context

Use widget state (e.g. via `useWidgetState` or `window.openai.widgetState`) for:

- Things the **model must know**:
  - Which item is selected in a list.
  - Current step in a multi-step process.
  - Short, structured summary of the UI context.

Avoid:

- Large blobs (long text, big arrays).
- Data the backend already stores.

**Pattern: “Context summary in widget state”**

When the widget’s UI state changes in a way that the model should know, store a **small summary** in widget state.

Example:

- User selects a product in a list:
  - UI shows details.
  - You write:

  ```js
  setWidgetState({
    selectedProductId: 'prod_123',
    selectedProductName: 'Acme Super Chair',
  });
  ```

- When the user later asks, “Is this one good for back pain?” the model sees which product is “this” via widget state.

### 4.3 Local UI-only state

Use plain React state (or similar) for purely visual concerns:

- Which accordion is expanded.
- Input text in a search field before you send it.
- Whether a particular menu is open.

**Rule of thumb:**

- Ask “Does the model need this?” → if no, keep it local UI state.
- Ask “Does the backend need this?” → if yes, send via tool call, not widget state.

### 4.4 Data flow pattern

A robust data flow uses:

1. **Input from ChatGPT / tools** → `toolOutput` → widget
2. **User action in widget** → `callTool` → backend
3. **Backend** → new structured data → `toolOutput` → widget re-render

For a React widget, this might look like:

```ts
const { toolOutput } = useOpenAiGlobal();
const [widgetState, setWidgetState] = useWidgetState();

useEffect(() => {
  if (!toolOutput) return;
  // Update UI from backend data
  setViewModel(transformToViewModel(toolOutput));
}, [toolOutput]);

const onUserClick = async (params) => {
  setUiPending(true);
  try {
    await window.openai.callTool('my_tool', {
      session_id: widgetState.sessionId,
      ...params,
    });
    // No need to manually set data here — toolOutput will update
  } finally {
    setUiPending(false);
  }
};
```

The key idea is to **treat `toolOutput` as the canonical data source** and avoid duplicating “real” state in the widget.

## 4.5 Event handling in non-React widgets (vanilla JS)

You don’t have to use React to build high-quality widgets. The Apps SDK is **framework-agnostic**: the host injects a `window.openai` object and fires events when globals change. Your non-React widget can subscribe to those events and re-render.

The canonical event is:

- **`openai:set_globals`** – fired whenever ChatGPT updates UI globals such as `toolOutput`, `widgetState`, locale, etc.

### 4.5.1 Core pattern (vanilla JS)

Recommended pattern:

1. **Keep UI state in module-scope variables** (or a small state object).
2. **Implement a pure `render()` function** that reads state and updates the DOM.
3. **Handle initial load** using `window.openai.toolOutput` if it exists.
4. **Subscribe to `openai:set_globals`** and update your state when `toolOutput` changes.
5. **Use `window.openai.callTool`** for widget-initiated actions, and update state from the returned response.

Example (adapted from the official todo quickstart):

```html
<script type="module">
  const listEl = document.querySelector('#todo-list');
  const formEl = document.querySelector('#add-form');
  const inputEl = document.querySelector('#todo-input');

  // 1) Local UI state, derived from toolOutput
  let tasks = [...(window.openai?.toolOutput?.tasks ?? [])];

  // 2) Pure renderer
  const render = () => {
    listEl.innerHTML = '';
    tasks.forEach((task) => {
      const li = document.createElement('li');
      li.dataset.id = task.id;
      li.dataset.completed = String(Boolean(task.completed));

      const label = document.createElement('label');
      label.style.display = 'flex';
      label.style.alignItems = 'center';
      label.style.gap = '10px';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = Boolean(task.completed);

      const span = document.createElement('span');
      span.textContent = task.title;

      label.appendChild(checkbox);
      label.appendChild(span);
      li.appendChild(label);
      listEl.appendChild(li);
    });
  };

  // 3) Update from explicit tool response (e.g. callTool)
  const updateFromResponse = (response) => {
    if (response?.structuredContent?.tasks) {
      tasks = response.structuredContent.tasks;
      render();
    }
  };

  // 4) React to openai:set_globals when toolOutput changes
  const handleSetGlobals = (event) => {
    const globals = event.detail?.globals;
    const toolOutput = globals?.toolOutput;
    if (!toolOutput?.tasks) return;
    tasks = toolOutput.tasks;
    render();
  };

  window.addEventListener('openai:set_globals', handleSetGlobals, {
    passive: true,
  });

  // 5) Tool-call helper for widget-initiated actions
  const callTodoTool = async (name, payload) => {
    if (window.openai?.callTool) {
      const response = await window.openai.callTool(name, payload);
      updateFromResponse(response); // keep UI in sync with backend
      return;
    }

    // Optional: local fallback if callTool isn't available
    mutateTasksLocally(name, payload);
  };

  // 6) Wire DOM events to tools
  formEl.addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = inputEl.value.trim();
    if (!title) return;
    await callTodoTool('add_todo', { title });
    inputEl.value = '';
  });

  listEl.addEventListener('change', async (event) => {
    const checkbox = event.target;
    if (!checkbox.matches('input[type="checkbox"]')) return;
    const id = checkbox.closest('li')?.dataset.id;
    if (!id) return;

    await callTodoTool('set_completed', { id, completed: checkbox.checked });
  });

  // 7) Initial render from initial toolOutput (if any)
  render();
</script>
```

### 4.5.2 Why this is _good_ practice, not a hack

This vanilla pattern is directly endorsed in the official quickstart: the todo widget uses a pure HTML+JS file, reads `window.openai.toolOutput` for initial state, and listens for `openai:set_globals` to keep its task list updated as new tool results arrive.

From an engineering perspective:

- **Event-driven, not polling** – you react when the host tells you globals changed, avoiding useless timers and race conditions.
- **Framework-agnostic** – you can use the same pattern in plain JS, Preact, Svelte, or any custom micro-framework.
- **Aligned with React hooks** – `useOpenAiGlobal()` in the React examples is just a nice wrapper around this same mechanism; using the event directly is the low-level canonical API.

### 4.5.3 Recommended patterns for non-React widgets

**Pattern: “render + handleGlobals”**

- Keep **all DOM updates** in a single `render()` (or a very small set of render functions).
- `handleSetGlobals`:
  - Reads `event.detail.globals.toolOutput` (and optionally `globals.widgetState`).
  - Updates your local state variables.
  - Calls `render()`.

This keeps the logic:

- Easy to test (you can unit-test `render()` and `handleSetGlobals` with synthetic globals).
- Easy to reason about (data flows one way: `toolOutput ⇒ state ⇒ render()`).

**Pattern: “dual source updates”**

- When the widget triggers a tool via `callTool()`:
  - Use the returned value to update state immediately (optimistic or exact update).
- When the model triggers a tool:
  - You’ll only see it via the `openai:set_globals` event, so your handler still updates the same way.

That ensures your widget stays in sync regardless of **who** initiated the tool call (model vs user in UI).

**Pattern: “small glue layer, big pure logic”**

- Keep the Apps SDK–specific bits tiny:
  - `window.addEventListener("openai:set_globals", …)`
  - `window.openai.callTool(...)`
- Put transformation and business logic into pure functions:

```js
function deriveTasksFromToolOutput(toolOutput) { ... }
function renderTasksInto(listEl, tasks) { ... }
```

That way, if you later migrate the widget to React, you mostly re-use those pure functions and swap the event wiring for hooks.

---

## 5. Tool Design & Integration Patterns

### 5.1 Tool surface design

Design tools to be:

- **Small, composable operations**:
  - `list_items`, `get_item_details`, `update_item`, `delete_item`, etc.
- **Explicit about side effects**:
  - Use metadata hints (e.g. read-only vs destructive) so ChatGPT can show confirmations when appropriate.
- **Model-friendly**:
  - Parameter names that align with natural language (“query”, “filters”, “sort_by”).
  - Types that are easy to reason about.

### 5.2 Tools used by both model and widget

Most tools will be used in two modes:

1. **Model-initiated**:
   - The user types something.
   - Model calls the tool.
   - Tool returns text + structured data (may include `outputTemplate` for widget).

2. **Widget-initiated**:
   - User clicks a button.
   - Widget calls `window.openai.callTool`.
   - Tool returns updated structured data only (no need to add new widget).

**Pattern: “Shared tool methods, different wrappers”**

- Write your actual business logic in plain functions/classes.
- Export minimal wrappers:
  - One for MCP (tool) layer.
  - Potentially another for internal backend usage.

Example:

```ts
async function listTodosCore(userId: string) {
  // real logic
}

export const list_todos = {
  // tool metadata...
  async handler(args, context) {
    const todos = await listTodosCore(context.userId);
    return {
      content: 'Here are your todos...',
      structuredContent: { todos },
    };
  },
};
```

The widget’s calls and the model’s calls both hit the same core logic.

### 5.3 Output templates and widget selection

Your tools control **which widget** to show by setting the output template metadata:

- For the first call that creates a widget:
  - Include an `_meta.openai/outputTemplate` pointing to your widget resource.
- For subsequent calls from the widget:
  - Usually **don’t** set a new template; just return updated `structuredContent`.
  - The existing widget instance will refresh.

**Pattern: “Template on first call only”**

- At backend level, detect if you already have a `session_id`:
  - If not: include the template (create widget).
  - If yes: omit the template (update existing widget).

---

## 6. UX Implementation Patterns

### 6.1 Small, purposeful UI slices

Treat widgets as **purpose-built slices** of your product:

- For each core use case, define:
  - “What does the widget let you _do_ in 1–2 interactions?”
  - “What does the conversation handle instead?”

Examples:

- **Good**:
  - Widget: choose from specific options, view structured information, perform a clearly defined action.
  - Conversation: ask “What should I do?”, “Explain this result”, “Compare these options.”

- **Bad**:
  - Widget tries to duplicate entire website navigation.
  - Widget adds generic chat input that competes with ChatGPT.

### 6.2 Interaction patterns in code

#### 6.2.1 “Ask → show widget → user chooses → backend updates”

Flow:

1. User: “Help me pick a cloud instance.”
2. Model calls `list_instances`.
3. Tool returns:
   - `structuredContent` = list of instances.
   - `_meta.openai/outputTemplate` = instance-chooser widget.
4. Widget renders list with radio buttons or cards.
5. User chooses “Instance A” and clicks “Confirm”.
6. Widget calls `window.openai.callTool("choose_instance", { id: "A" })`.
7. Backend updates and returns new structured data (e.g. confirmation, config).
8. Widget updated; ChatGPT can also be prompted to summarize choice.

This pattern is a **classic wizard-with-card** flow.

#### 6.2.2 “Data explorer” pattern

- Inline card:
  - Shows a summary or small preview (e.g. a mini table).
  - Has “Open in fullscreen” button.

- Fullscreen:
  - Renders full table with pagination, filters, sort toggles.
  - All filter controls call a `search` or `list` tool.
  - `toolOutput` is used to (re)render table.

Implementation notes:

- Keep the filter state mirrored:
  - UI: checkboxes, dropdowns.
  - Backend: filter params in tool calls.
  - Model-aware: optionally store current filters in widget state (so follow-up questions align).

#### 6.2.3 “Ongoing agent” pattern (PiP)

- Inline card sets up the agent and session.
- PiP displays minimal state:
  - Status: “Running”, “Paused”.
  - Last important metric.
  - One action button: “Pause” / “Resume”.

- Widget calls tools periodically:
  - Either triggered by user interactions.
  - Or triggered by ChatGPT using your tools in the background.
- Tool outputs update PiP; PiP does not spam the chat—just updates the overlay.

### 6.3 Avoiding antipatterns

**Antipatterns to avoid:**

- Every tool response sets a new widget template:
  - Leads to dozens of cards.
  - Hard to track which widget is current.

- Custom chat box inside widget for free-form text:
  - Confuses users: “Where do I type?”
  - Breaks ChatGPT’s core affordance.

- Nested scroll views:
  - Scroll-jacking, especially on mobile.
  - Hard to use with screen readers.

- Overbranding the widget:
  - Loud colors, custom fonts, full logo banners.
  - Makes it feel unsafe / non-native.

- Shipping business logic in the widget:
  - Results in diverging behavior vs backend.
  - Harder to test and maintain.

---

## 7. Performance, Reliability & Testing

### 7.1 Performance patterns

- **Minimize bundle size:**
  - Avoid pulling in large UI frameworks beyond what’s needed.
  - Prefer the Apps SDK’s provided components and Tailwind setup.
  - Code-split if you must do something heavy.

- **Be fast on first render:**
  - Show skeleton UI or basic layout immediately.
  - Render from initial `toolOutput` synchronously.
  - Defer heavy data fetching to additional tool calls if necessary.

- **Efficient data representation:**
  - Don’t send unnecessary fields in `structuredContent`.
  - Paginate large results (page tokens, limits).
  - Use IDs instead of embedding entire objects when referencing previously-known data.

### 7.2 Reliability patterns

- **Defensive UI:**
  - Always handle `toolOutput` being missing or partial.
  - Show user-friendly error messages when tool calls fail.
  - Disable buttons while a call is in-flight; re-enable after response.

- **Retry logic:**
  - Implement simple retry for transient network failures when the widget calls your backend.
  - Clearly communicate if something cannot be completed.

- **Backend invariants:**
  - Validate all input, even from the widget.
  - Never assume the widget will call tools in a predictable sequence (the model might call them too).

### 7.3 Testing strategy

- **Unit tests for backend tools**:
  - Tools are just functions; test them with typical and edge-case arguments.
- **Component tests for widgets**:
  - Render the root component with fake `toolOutput`.
  - Verify it renders the right DOM.
- **Integration tests in development mode**:
  - Use ChatGPT’s dev tooling to:
    - Simulate tool calls.
    - Inspect widget behavior.
    - Confirm that `widgetState` and `toolOutput` are in sync.

---

## 8. Putting It All Together – Example Pattern Blueprint

Here’s an abstract, end-to-end pattern you can reuse.

### 8.1 Use case

“Interactive planner” widget that helps users pick and refine a plan (e.g. travel, roadmap, workout).

### 8.2 Components

- **Tool: `create_plan`**
  - Inputs: user preferences.
  - Outputs:
    - `session_id`.
    - Initial plan items in `structuredContent`.
    - `_meta.openai/outputTemplate` for the planner widget.

- **Tool: `update_plan`**
  - Inputs: `session_id`, action (`add_item`, `remove_item`, `reorder`, etc.), payload.
  - Outputs:
    - Updated plan.

- **Widget: planner**
  - Inline: shows small summary of plan and a couple of actions.
  - Fullscreen: full list editing (drag-and-drop, etc).

### 8.3 Flow

1. User: “Help me plan a 3-day trip to Barcelona.”
2. Model calls `create_plan`.
3. Backend:
   - Creates a session.
   - Generates initial plan.
   - Returns text + `structuredContent + outputTemplate`.
4. Inline widget appears with short plan summary and button “Edit plan”.
5. User clicks “Edit plan” → widget calls `requestDisplayMode({ mode: "fullscreen" })`.
6. In fullscreen:
   - User removes a day, reorders items, adds a new activity.
   - Each action calls `update_plan(session_id, ...)`.
   - Backend updates plan and returns new structured data.
7. Widget re-renders updated plan after each tool call.
8. When user is done, they click “Done”:
   - Widget calls `window.openai.requestClose()` (or signals completion).
   - ChatGPT receives updated plan summary via structured content and can now answer high-level questions.

Throughout:

- **One session, one widget instance.**
- Backend is source of truth.
- Widget is thin: just visual editor + tool caller.
- Model can “see” a summary of current plan via widget state and structured content.

---

## 9. Checklist for Production-Quality Widgets

Use this checklist when building or reviewing a widget:

### Architecture

- [ ] Single logical widget per task/session, not one per tool call.
- [ ] Backend holds the canonical state; widget treats `toolOutput` as source of truth.
- [ ] Session ID pattern implemented for multi-step workflows.

### Display Modes

- [ ] Inline for simple/summarized views.
- [ ] Fullscreen available for complex workflows or exploration.
- [ ] PiP only when a persistent overlay is clearly justified.

### State Management

- [ ] Widget state used only for small, model-relevant summaries.
- [ ] Local UI state used for purely visual/intermediate values.
- [ ] No duplication of business-critical state inside the widget.

### Tool Design

- [ ] Tools are small, composable, and clearly named.
- [ ] Shared business logic behind both model-initiated and widget-initiated calls.
- [ ] First tool call sets `outputTemplate`; subsequent calls only update data.

### UX

- [ ] The widget does one clear, well-defined job.
- [ ] No nested scrolling or heavy navigation inside the card.
- [ ] At most 1–2 primary actions per card.
- [ ] No custom generic chat input inside the widget.
- [ ] Visual style matches ChatGPT: typography, spacing, borders, minimal branding.

### Performance & Reliability

- [ ] Bundle is small and loads quickly.
- [ ] UI shows skeleton/loading states appropriately.
- [ ] Errors are surfaced as clear, user-visible messages.
- [ ] Network and backend failures are handled gracefully.

If you build your OpenAI App widgets following these patterns, you’ll get:

- Minimal chat clutter (one persistent widget per workflow).
- A clear separation of concerns between conversation, backend logic, and UI.
- A user experience that feels native to ChatGPT and scales well as complexity grows.
