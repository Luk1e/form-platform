-- Disable foreign key checks to allow dropping tables
SET FOREIGN_KEY_CHECKS = 0;

-- User Management
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    is_blocked BOOLEAN DEFAULT FALSE,
    preferred_theme ENUM('light', 'dark') DEFAULT 'light',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- Template Topics (predefined list)
DROP TABLE IF EXISTS template_topics;
CREATE TABLE template_topics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Predefined topics
INSERT INTO template_topics (name) VALUES 
('Education'), 
('Quiz'), 
('Other');

-- Templates
DROP TABLE IF EXISTS templates;
CREATE TABLE templates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    topic_id INT,
    image_url VARCHAR(255),
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES template_topics(id) ON DELETE SET NULL
);

-- Full-Text Search Index for Templates
CREATE FULLTEXT INDEX idx_fulltext_template ON templates(title, description);
CREATE INDEX idx_templates_user_id ON templates(user_id);
CREATE INDEX idx_templates_topic_id ON templates(topic_id);
CREATE INDEX idx_templates_created_at ON templates(created_at);

-- Template Tags
DROP TABLE IF EXISTS template_tags;
CREATE TABLE template_tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL
);
CREATE INDEX idx_template_tags_name ON template_tags(name);

-- Junction table for Templates and Tags
DROP TABLE IF EXISTS template_tag_mapping;
CREATE TABLE template_tag_mapping (
    template_id INT,
    tag_id INT,
    PRIMARY KEY (template_id, tag_id),
    FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES template_tags(id) ON DELETE CASCADE
);

-- Template Access Control (for private templates)
DROP TABLE IF EXISTS template_access_control;
CREATE TABLE template_access_control (
    template_id INT,
    user_id INT,
    PRIMARY KEY (template_id, user_id),
    FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Question Types
DROP TABLE IF EXISTS question_types;
CREATE TABLE question_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name ENUM('single_line', 'multi_line', 'integer', 'checkbox', 'single_choice') NOT NULL
);

-- Insert default question types
INSERT INTO question_types (name) VALUES 
('single_line'), 
('multi_line'), 
('integer'), 
('checkbox'),
('single_choice');

-- Template Questions
DROP TABLE IF EXISTS template_questions;
CREATE TABLE template_questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    template_id INT NOT NULL,
    type_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    display_in_summary BOOLEAN DEFAULT FALSE,
    position INT NOT NULL,
    is_required BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE,
    FOREIGN KEY (type_id) REFERENCES question_types(id) ON DELETE RESTRICT
);

CREATE FULLTEXT INDEX idx_fulltext_questions ON template_questions(title, description);
CREATE INDEX idx_template_questions_template_id ON template_questions(template_id);
CREATE INDEX idx_template_questions_type_id ON template_questions(type_id);

-- Question Options (for single choice and other list-based questions)
DROP TABLE IF EXISTS question_options;
CREATE TABLE question_options (
    id INT PRIMARY KEY AUTO_INCREMENT,
    question_id INT NOT NULL,
    value VARCHAR(255) NOT NULL,
    FOREIGN KEY (question_id) REFERENCES template_questions(id) ON DELETE CASCADE
);

-- Filled Forms
DROP TABLE IF EXISTS filled_forms;
CREATE TABLE filled_forms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    template_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_filled_forms_template_id ON filled_forms(template_id);
CREATE INDEX idx_filled_forms_user_id ON filled_forms(user_id);
CREATE INDEX idx_filled_forms_created_at ON filled_forms(created_at);

-- Form Answers
DROP TABLE IF EXISTS form_answers;
CREATE TABLE form_answers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    form_id INT NOT NULL,
    question_id INT NOT NULL,
    string_value VARCHAR(255),
    text_value TEXT,
    integer_value INT,
    boolean_value BOOLEAN,
    single_choice_value VARCHAR(255),
    FOREIGN KEY (form_id) REFERENCES filled_forms(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES template_questions(id) ON DELETE CASCADE
);

-- Comments
DROP TABLE IF EXISTS comments;
CREATE TABLE comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    template_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_comments_template_id ON comments(template_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);

-- Likes
DROP TABLE IF EXISTS likes;
CREATE TABLE likes (
    user_id INT,
    template_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, template_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE
);

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

