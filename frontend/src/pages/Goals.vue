<template>
  <div class="goals-container">
    <h2>🎯 Your Goals</h2>

    <!-- Create Goal -->
    <form @submit.prevent="addGoal" class="goal-form">
      <input v-model="newGoal.name" placeholder="Goal name" required />
      <textarea v-model="newGoal.description" placeholder="Goal description" required></textarea>
      <button type="submit">Add Goal</button>
    </form>

    <hr />

    <!-- Goals List -->
    <div v-if="goals.length">
      <h3>My Goals:</h3>
      <ul>
        <li v-for="goal in goals" :key="goal.id">
          <strong>{{ goal.name }}</strong>
          <p>{{ goal.description }}</p>

          <button @click="editGoal(goal)">✏️ Edit</button>
          <button @click="deleteGoal(goal.id)">🗑 Delete</button>
        </li>
      </ul>
    </div>
    <p v-else>No goals yet. Add one above!</p>

    <!-- Edit Modal -->
    <div v-if="editingGoal" class="modal">
      <h3>Edit Goal</h3>
      <input v-model="editingGoal.name" />
      <textarea v-model="editingGoal.description"></textarea>
      <button @click="updateGoal">💾 Save</button>
      <button @click="cancelEdit">❌ Cancel</button>
    </div>

    <!-- Feedback message -->
    <p v-if="message" :style="{ color: success ? 'green' : 'red' }">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api"; // axios instance with JWT interceptor

const goals = ref([]);
const newGoal = ref({ name: "", description: "" });
const editingGoal = ref(null);
const message = ref("");
const success = ref(false);

// ✅ Fetch all goals
async function fetchGoals() {
  try {
    const res = await api.get("/api/goals"); // no userId needed
    goals.value = res.data;
  } catch (err) {
    console.error(err);
    message.value = "Failed to load goals. Make sure you are logged in.";
    success.value = false;
  }
}

// ✅ Add a new goal
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

// ✅ Open goal for editing
function editGoal(goal) {
  editingGoal.value = { ...goal };
}

// ✅ Update an existing goal
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

// ✅ Delete a goal
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

// ✅ Cancel editing
function cancelEdit() {
  editingGoal.value = null;
}

// Fetch goals when component mounts
onMounted(fetchGoals);
</script>

<style scoped>
.goals-container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
}
.goal-form input,
.goal-form textarea {
  width: 100%;
  margin-bottom: 10px;
}
.modal {
  background: #eee;
  padding: 15px;
  border-radius: 8px;
}
button {
  margin-right: 5px;
  margin-top: 5px;
}
</style>
