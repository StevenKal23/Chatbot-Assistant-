import { db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp, doc, runTransaction } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const questions = [
    " Hello! What’s your full name?",
    "What’s your phone number?",
    "What’s your email?",
    "What service are you interested in?",
    "How did you hear about us?"
  ];

  const inputNames = [
    "full_name",
    "phone_number",
    "email",
    "service_interest",
    "referral_source"
  ];

  let currentQuestion = 0;
  let answers = {};

  const chatbox = document.getElementById("chat-box");
  const input = document.getElementById("user-Input");
  const form = document.getElementById("chat-Form");

  const services = [
    "Wholesale Internet Capacity",
    "Hotspot Setup & Management",
    "ISP Billing & Automation",
    "Equipment Sales (Routers, Access Points, etc.)",
    "Training & Consulting (site serveys)"
  ];

  function showServiceOptions() {
    const oldOptions = document.getElementById("service-options");
    if (oldOptions) oldOptions.remove();

    const optionsDiv = document.createElement("div");
    optionsDiv.id = "service-options";
    optionsDiv.style.margin = "10px 0";

    services.forEach((service, idx) => {
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "service_interest";
      radio.value = service;
      radio.id = "service_" + idx;

      const label = document.createElement("label");
      label.setAttribute("for", radio.id);
      label.textContent = service;

      // Auto-submit when selected
      radio.addEventListener("change", () => {
        form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
      });

      // Wrap radio and label for styling
      const wrapper = document.createElement("div");
      wrapper.style.display = "flex";
      wrapper.style.alignItems = "center";
      wrapper.appendChild(radio);
      wrapper.appendChild(label);

      optionsDiv.appendChild(wrapper);
    });

    form.insertBefore(optionsDiv, input);
    input.style.display = "none";
  }

  function hideServiceOptions() {
    const optionsDiv = document.getElementById("service-options");
    if (optionsDiv) optionsDiv.remove();
    input.style.display = "";
  }

  function askQuestion() {
    const botMsg = document.createElement("div");
    botMsg.className = "bot-message";
    botMsg.textContent = questions[currentQuestion];
    chatbox.appendChild(botMsg);
    scrollToBottom();

    // Show radio options for service_interest
    if (inputNames[currentQuestion] === "service_interest") {
      showServiceOptions();
    } else {
      hideServiceOptions();
    }
  }

  function scrollToBottom() {
    chatbox.scrollTop = chatbox.scrollHeight;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let userText;
    const currentInputName = inputNames[currentQuestion];

    if (currentInputName === "service_interest") {
      const checked = document.querySelector('input[name="service_interest"]:checked');
      userText = checked ? checked.value : "";
      if (!userText) {
        alert("Please select a service.");
        return;
      }
    } else {
      userText = input.value.trim();
      if (!userText) return;
    }

    // 🔒 Validation logic
    if (currentInputName === "phone_number" && !/^\+?\d{7,15}$/.test(userText)) {
      showBotNotification("⚠️ Please enter a valid phone number (digits only, optional +).");
      return;
    }

    if (currentInputName === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userText)) {
      showBotNotification("⚠️ Please enter a valid email address.");
      return;
    }

    // ✅ Display user message
    const userMsg = document.createElement("div");
    userMsg.className = "user-message";
    userMsg.textContent = userText;
    chatbox.appendChild(userMsg);
    scrollToBottom();

    answers[currentInputName] = userText;
    input.value = "";
    currentQuestion++;

    if (currentQuestion < questions.length) {
      setTimeout(askQuestion, 500);
    } else {
      try {
        const counterRef = doc(db, "metadata", "clients");
        await runTransaction(db, async (transaction) => {
            const counterDoc = await transaction.get(counterRef);
            let newId = 1;
            if (counterDoc.exists()) {
                newId = counterDoc.data().count + 1;
            }
            transaction.set(counterRef, { count: newId });

            await addDoc(collection(db, "clients"), {
                clientId: String(newId).padStart(2, '0'),
                ...answers,
                created_at: serverTimestamp()
            });
        });

        const confirmMsg = document.createElement("div");
        confirmMsg.className = "bot-message";
        confirmMsg.textContent = "✅ Thank you! Your responses have been recorded.";
        chatbox.appendChild(confirmMsg);
        scrollToBottom();

        setTimeout(() => {
          chatbox.innerHTML = "";
          answers = {};
          currentQuestion = 0;
          askQuestion();
        }, 3000);
      } catch (err) {
        console.error("Error adding document: ", err);
        const errorMsg = document.createElement("div");
        errorMsg.className = "bot-message";
        errorMsg.textContent = "🚫 Error sending your data. Please try again.";
        chatbox.appendChild(errorMsg);
        scrollToBottom();
      }
    }
  });
  // Start the conversation
  askQuestion();

  function showBotNotification(message) {
      const notification = document.createElement("div");
      notification.className = "bot-notification";
      notification.textContent = message;
      notification.style.margin = "10px 0";
      notification.style.background = "#232b3e";
      notification.style.color = "#ffb4b4";
      notification.style.padding = "12px 18px";
      notification.style.borderRadius = "10px";
      notification.style.fontWeight = "500";
      notification.style.textAlign = "center";
      notification.style.boxShadow = "0 2px 8px rgba(49,130,206,0.06)";
      chatbox.appendChild(notification);

      setTimeout(() => {
          notification.remove();
      }, 4000);
  }
});
