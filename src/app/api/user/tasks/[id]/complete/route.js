// ============================================================
// src/app/api/user/tasks/[id]/complete/route.js
// Mark task as completed
// ============================================================

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getUser } from '@/lib/auth'

export async function POST(request, { params }) {
  try {
    const user = await getUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const taskId = params.id

    // Check if task exists
    const { data: task } = await supabaseAdmin
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single()

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    const { data: existingTask } = await supabaseAdmin
      .from('user_tasks')
      .select('*')
      .eq('user_id', user.id)
      .eq('task_id', taskId)
      .single()

    if (existingTask?.completed_at) {
      return NextResponse.json({ success: true, completion: existingTask })
    }

    let completion
    if (existingTask) {
      const { data, error } = await supabaseAdmin
        .from('user_tasks')
        .update({ completed_at: new Date().toISOString() })
        .eq('id', existingTask.id)
        .select()
        .single()

      if (error) throw error
      completion = data
    } else {
      const { data, error } = await supabaseAdmin
        .from('user_tasks')
        .insert({
          user_id: user.id,
          task_id: taskId,
          completed_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      completion = data
    }

    // Add reward to wallet only once
    if (task.reward > 0 && !existingTask?.completed_at) {
      const { data: wallet } = await supabaseAdmin
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (wallet) {
        await supabaseAdmin
          .from('wallets')
          .update({
            balance: (wallet.balance || 0) + task.reward,
            total_earned: (wallet.total_earned || 0) + task.reward,
          })
          .eq('user_id', user.id)
      }
    }

    return NextResponse.json({ success: true, completion })
  } catch (err) {
    console.error('[task complete error]', err)
    return NextResponse.json({ error: 'Failed to complete task' }, { status: 500 })
  }
}
