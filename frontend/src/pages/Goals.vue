<template>
  <div class="goals-container">
    <h2>🎯 Your Goals</h2>

    <!-- Create Goal -->
    <form @submit.prevent="addGoal" class="goal-form">
      <input v-model="newGoal.name" placeholder="Goal name" required />
      <textarea v-model="newGoal.description" placeholder="Goal description" required></textarea>
      <button type="submit" class="submit-btn">Add Goal</button>
    </form>

    <hr />

    <!-- Goals List -->
    <div v-if="goals.length">
      <h3>My Goals:</h3>
      <ul>
        <li v-for="goal in goals" :key="goal.id" class="goal-item">
          <strong>{{ goal.name }}</strong>
          <p>{{ goal.description }}</p>
          <div class="goal-actions">
            <button @click="editGoal(goal)" class="edit-btn">✏️ Edit</button>
            <button @click="deleteGoal(goal.id)" class="delete-btn">🗑 Delete</button>
          </div>
        </li>
      </ul>
    </div>
    <p v-else class="no-goals">No goals yet. Add one above!</p>

    <!-- Edit Modal -->
    <div v-if="editingGoal" class="modal">
      <h3>Edit Goal</h3>
      <input v-model="editingGoal.name" placeholder="Goal name" />
      <textarea v-model="editingGoal.description" placeholder="Goal description"></textarea>
      <div class="modal-actions">
        <button @click="updateGoal" class="submit-btn">💾 Save</button>
        <button @click="cancelEdit" class="cancel-btn">❌ Cancel</button>
      </div>
    </div>

    <!-- Feedback message -->
    <p v-if="message" :class="success ? 'success-msg' : 'error-msg'">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";

const goals = ref([]);
const newGoal = ref({ name: "", description: "" });
const editingGoal = ref(null);
const message = ref("");
const success = ref(false);

async function fetchGoals() {
  try {
    const res = await api.get("/api/goals");
    goals.value = res.data;
  } catch (err) {
    console.error(err);
    message.value = "Failed to load goals. Make sure you are logged in.";
    success.value = false;
  }
}

async function addGoal() {
  try {
    if (!newGoal.value.name || !newGoal.value.description) {
      message.value = "Please fill in all fields.";
      success.value = false;
      return;
    }
    await api.post("/api/goals", {
      name: newGoal.value.name,
      description: newGoal.value.description,
    });
    message.value = "Goal added successfully!";
    success.value = true;
    newGoal.value = { name: "", description: "" };
    fetchGoals();
  } catch (err) {
    console.error(err);
    message.value = err.response?.data?.error || "Failed to add goal.";
    success.value = false;
  }
}

function editGoal(goal) {
  editingGoal.value = { ...goal };
}

async function updateGoal() {
  try {
    await api.patch(`/api/goals/${editingGoal.value.id}`, {
      name: editingGoal.value.name,
      description: editingGoal.value.description,
    });
    message.value = "Goal updated successfully!";
    success.value = true;
    editingGoal.value = null;
    fetchGoals();
  } catch (err) {
    console.error(err);
    message.value = "Failed to update goal.";
    success.value = false;
  }
}

async function deleteGoal(id) {
  if (!confirm("Delete this goal?")) return;
  try {
    await api.delete(`/api/goals/${id}`);
    message.value = "Goal deleted successfully!";
    success.value = true;
    fetchGoals();
  } catch (err) {
    console.error(err);
    message.value = "Failed to delete goal.";
    success.value = false;
  }
}

function cancelEdit() {
  editingGoal.value = null;
}

onMounted(fetchGoals);
</script>

<style scoped>
/* Container */
.goals-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 25px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  color: #fff;
}

/* Headings */
h2, h3 {
  text-align: center;
  margin-bottom: 15px;
}

/* Goal form & modal inputs */
.goal-form input,
.goal-form textarea,
.modal input,
.modal textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 12px;
  border-radius: 10px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.goal-form input::placeholder,
.goal-form textarea::placeholder,
.modal input::placeholder,
.modal textarea::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

/* Submit buttons */
.submit-btn {
  padding: 10px 15px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #00ff9d, #00d4ff);
  color: #000;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
}

.submit-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 255, 157, 0.5);
}

/* Goals list */
.goal-item {
  padding: 12px;
  margin-bottom: 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  transition: all 0.3s;
}

.goal-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.goal-actions {
  margin-top: 8px;
}

.edit-btn,
.delete-btn,
.cancel-btn {
  padding: 5px 10px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  margin-right: 5px;
  transition: all 0.3s;
}

.edit-btn {
  background: linear-gradient(135deg, #00ff9d, #00d4ff);
  color: #000;
}

.edit-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 255, 157, 0.5);
}

.delete-btn {
  background: rgba(255, 77, 109, 0.8);
  color: #fff;
}

.delete-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(255, 77, 109, 0.5);
}

.cancel-btn {
  background: rgba(200, 200, 200, 0.2);
  color: #fff;
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Modal */
.modal {
  margin-top: 20px;
  padding: 15px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
}

/* Feedback messages */
.success-msg {
  color: #00ff9d;
  text-align: center;
  margin-top: 10px;
}

.error-msg {
  color: #ff4d6d;
  text-align: center;
  margin-top: 10px;
}

.no-goals {
  text-align: center;
  margin-top: 20px;
  color: rgba(255, 255, 255, 0.7);
}
</style>
