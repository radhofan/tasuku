'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  GFillButton,
  GStrokeButton,
  GCard,
  GText,
  GSpinner,
  GBadge,
  GBox
} from '../components/Gamut';

interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function Home() {
  const queryClient = useQueryClient();
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch all todos
  const { data: todos = [], isLoading, isError, error } = useQuery<Todo[]>({
    queryKey: ['todos'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/todos`);
      if (!res.ok) {
        throw new Error('Failed to fetch todos from server.');
      }
      return res.json();
    }
  });

  // Create new todo
  const createMutation = useMutation({
    mutationFn: async (newTodo: { title: string; description: string }) => {
      const res = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to create todo.');
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setNewTitle('');
      setNewDesc('');
      setErrorMsg(null);
    },
    onError: (err: Error) => {
      setErrorMsg(err.message);
    }
  });

  // Toggle completed status
  const toggleMutation = useMutation({
    mutationFn: async (todo: Todo) => {
      const res = await fetch(`${API_URL}/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update todo.');
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onError: (err: Error) => {
      setErrorMsg(err.message);
    }
  });

  // Delete todo
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete todo.');
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onError: (err: Error) => {
      setErrorMsg(err.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setErrorMsg('Todo title is required.');
      return;
    }
    createMutation.mutate({ title: newTitle, description: newDesc });
  };

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-title-container">
          <GText variant="title-xxl" as="h1" className="app-title">
            たすく Tasuku
          </GText>
          <GText variant="p-small" as="p" className="app-subtitle">
            Personal Todo Tracker
          </GText>
        </div>
      </header>

      <main className="app-main">
        {/* Error Alert Bar */}
        {(errorMsg || isError) && (
          <div className="custom-alert">
            <span className="alert-message">
              {errorMsg || (error as Error)?.message || 'Something went wrong.'}
            </span>
            <button className="alert-close" onClick={() => setErrorMsg(null)}>
              ×
            </button>
          </div>
        )}

        {/* Task Stats Board */}
        <GCard style={{ padding: '20px 30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <GText variant="title-sm" as="h3" style={{ margin: 0 }}>
              Progress Tracker
            </GText>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span className="custom-badge badge-pending">
                Pending: {todos.length - completedCount}
              </span>
              <span className="custom-badge badge-completed">
                Completed: {completedCount} / {todos.length}
              </span>
            </div>
          </div>
        </GCard>

        {/* Add Todo Form */}
        <GCard>
          <GText variant="title-md" as="h2" style={{ margin: '0 0 20px 0', fontFamily: 'Georgia, serif' }}>
            Add New Task
          </GText>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="todo-title">Task Title *</label>
              <input
                id="todo-title"
                type="text"
                className="text-input"
                placeholder="What needs to be done?"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                disabled={createMutation.isPending}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="todo-desc">Description (Optional)</label>
              <textarea
                id="todo-desc"
                className="textarea-input"
                placeholder="Add some details about this task..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                disabled={createMutation.isPending}
              />
            </div>
            <div style={{ marginTop: '24px', textAlign: 'right' }}>
              <GFillButton type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Adding...' : 'Add Todo'}
              </GFillButton>
            </div>
          </form>
        </GCard>

        {/* Todo List Area */}
        <div className="todo-list-container">
          <GText variant="title-md" as="h2" style={{ margin: '0 0 20px 0', fontFamily: 'Georgia, serif' }}>
            My Todo List
          </GText>

          {isLoading ? (
            <GCard style={{ textAlign: 'center', padding: '50px' }}>
              <GSpinner />
              <GText variant="p-base" as="p" style={{ marginTop: '16px', fontWeight: 500 }}>
                Loading todos from database...
              </GText>
            </GCard>
          ) : todos.length === 0 ? (
            <GCard className="empty-state">
              <span className="empty-state-icon">📝</span>
              <span className="empty-state-text">No todos yet! Add some tasks above to get started.</span>
            </GCard>
          ) : (
            todos.map((todo) => (
              <GCard key={todo.id} className={`todo-card ${todo.completed ? 'completed' : ''}`}>
                <div className="todo-layout">
                  <div className="todo-left">
                    <div className="todo-checkbox-wrapper">
                      <input
                        type="checkbox"
                        className="todo-checkbox"
                        checked={todo.completed}
                        onChange={() => toggleMutation.mutate(todo)}
                        disabled={toggleMutation.isPending}
                      />
                    </div>
                    <div className="todo-details">
                      <h3 className="todo-title">{todo.title}</h3>
                      {todo.description && (
                        <p className="todo-desc">{todo.description}</p>
                      )}
                      <div className="todo-meta">
                        <span className={`custom-badge ${todo.completed ? 'badge-completed' : 'badge-pending'}`}>
                          {todo.completed ? 'Completed' : 'Pending'}
                        </span>
                        <GText variant="p-small" as="span" style={{ color: '#7d88a1' }}>
                          Created: {new Date(todo.createdAt).toLocaleDateString()}
                        </GText>
                      </div>
                    </div>
                  </div>
                  <div className="todo-actions">
                    <GStrokeButton
                      className="danger-btn"
                      onClick={() => deleteMutation.mutate(todo.id)}
                      disabled={deleteMutation.isPending}
                    >
                      Delete
                    </GStrokeButton>
                  </div>
                </div>
              </GCard>
            ))
          )}
        </div>
      </main>

      <footer className="app-footer">
        <GText variant="p-small" as="p">
          Tasuku Planner © 2026 • Codecademy Gamut Inspired UI
        </GText>
      </footer>
    </div>
  );
}
