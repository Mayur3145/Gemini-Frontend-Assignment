# Gemini Frontend Clone
A modern conversational AI chat application inspired by Gemini, built with Next.js, Tailwind CSS, Redux Toolkit, and TypeScript.



# Live Demo
https://gemini-frontend-assignment.vercel.app/auth

# screenshots
<img width="1910" height="891" alt="image" src="https://github.com/user-attachments/assets/3ef24cb9-56f9-41e5-875f-9835e8058211" />
<img width="1812" height="897" alt="image" src="https://github.com/user-attachments/assets/899427a5-2f89-4fc5-831b-a514ac5e5a9e" />
<img width="1892" height="877" alt="image" src="https://github.com/user-attachments/assets/3ff6ff2b-80d6-4cfb-81cc-8126d3187ab4" />





## 🛠️ Setup & Run Instructions

### 📁 Clone the Repository

git clone https://github.com/your-username/gemini-frontend-clone.git

cd gemini-frontend-clone

### Install dependencies:
npm install

### Start the development server:
npm run dev

### Open in your browser:
http://localhost:3000


# Folder & Component Structure


## 🔍 Folder Breakdown

- `app/` – Contains all the main routes using **Next.js App Router**, including:
  - `auth/` – Login & OTP flow
  - `chatroom/[id]/` – Individual chat pages
  - `dashboard/` – User dashboard

- `components/` – Organized by feature:
  - `auth/` – Login & OTP UI
  - `chat/` – Chat messages, input, typing UI
  - `chatroom/` – Client-side chatroom logic
  - `dashboard/` – Chatroom list, search, and creation
  - `ui/` – Shared utilities like dark mode toggle, toast notifications

- `store/` – Redux slices for:
  - `auth` – User authentication
  - `chatroom` – Chatroom data
  - `messages` – Message state
  - Plus the root Redux store configuration

- `hooks/` – Custom React hooks
  - `useDebounce` – Debounce logic for input optimization

- `utils/` – Utility modules


    
# Key Features & Implementations

## ⚙️ Features

### 🔁 **Throttling (Debounce)**  
**Purpose:** Prevents excessive Redux state updates during search operations  
**Implementation:** Custom `useDebounce` hook delays search execution until typing stops  
**Benefit:** Reduces unnecessary API calls and state updates for better performance

---

### 📜 **Pagination & Infinite Scroll**  
**Purpose:** Efficiently handles large message datasets  
**Implementation:**  
- Messages load in chunks (20 per page)  
- Automatically fetches older messages when scrolling up  
- State management via **Redux** tracks current page and available messages  
**Benefit:** Smooth scrolling experience without loading all data at once

---

### ✅ **Form Validation**  
**Purpose:** Ensures valid user input before submission  
**Implementation:**  
- `React Hook Form` for form state management  
- `Zod` for schema-based validation rules  
- Custom error messages for user feedback  
**Benefit:** Prevents invalid submissions and improves UX



## ✨ Additional Features

- 🌙 **Dark/Light Mode**  
  Implemented using CSS variables and `localStorage` for theme persistence

- 🖼️ **Image Uploads**  
  Base64 previews with client-side image handling

- 🔔 **Toast Notifications**  
  Instant contextual feedback using Shadcn UI's toast system

- 📱 **Responsive Design**  
  Mobile-first layout powered by Tailwind CSS breakpoints

- ⏳ **Loading Skeletons**  
  Skeleton UI placeholders during data fetches for smooth UX

- 📋 **Copy-to-Clipboard**  
  One-click copy of message content on hover

- 🔽 **Auto-scroll**  
  Auto scrolls to the latest message in chat view

- ✍️ **Typing Indicators**  
  Displays “typing…” animations during AI responses

---

## 🧰 Technologies Used

- ⚙️ **Framework:** Next.js 15 (App Router)
- 🔄 **State Management:** Redux Toolkit
- 🎨 **Styling:** Tailwind CSS
- 📝 **Form Handling:** React Hook Form + Zod
- 🧩 **UI Components:** Shadcn UI
- 🎯 **Icons:** Lucide React
- 🌐 **HTTP Client:** Axios
- 🚀 **Deployment:** Vercel
