import { integer, text, real } from "drizzle-orm/gel-core";
import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull().unique(),
  password_hash: varchar("password_hash").notNull(),
  bmi: real("bmi")
});

export const goals = pgTable("goals", {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade"}),
    name: varchar("name", { length: 256 }).notNull(),
    description: text("description").notNull(),

})