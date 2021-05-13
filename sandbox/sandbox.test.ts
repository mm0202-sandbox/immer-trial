/* eslint-disable @typescript-eslint/ban-ts-comment */

import { enableMapSet } from 'immer'

enableMapSet()

import produce from 'immer'

describe('sandbox', () => {
  describe('公式ドキュメント (https://immerjs.github.io/immer/)', () => {
    describe('Basic', () => {
      describe('Using produce', () => {
        test('Example', () => {
          const baseState = [
            {
              todo: 'Learn typescript',
              done: true,
            },
            {
              todo: 'Try immer',
              done: false,
            },
          ]

          const nextState = produce(baseState, (draftState) => {
            // @ts-ignore
            draftState.push({ todo: 'Tweet about it' })
            draftState[1].done = true
          })

          expect(baseState.length).toBe(2)
          expect(nextState.length).toBe(3)

          expect(baseState[1].done).toBe(false)
          expect(nextState[1].done).toBe(true)

          expect(nextState[0]).toBe(baseState[0])
          expect(nextState[1]).not.toBe(baseState[1])
        })
      })

      describe('Curried producers', () => {
        test('Example', () => {
          const mapper = produce((draft, index) => {
            draft.index = index
          })

          expect([{}, {}, {}].map(mapper)).toStrictEqual([
            { index: 0 },
            { index: 1 },
            { index: 2 },
          ])
        })
      })

      describe('Update patterns', () => {
        test('Object mutations', () => {
          const todosObj = {
            id1: { done: false, body: 'Take out the trash' },
            id2: { done: false, body: 'Check Email' },
          }

          // add
          const addedTodosObj = produce(todosObj, (draft) => {
            // @ts-ignore
            draft['id3'] = { done: false, body: 'Buy bananas' }
          })
          expect(Object.keys(addedTodosObj)).toHaveLength(3)
          // @ts-ignore
          expect(addedTodosObj.id3).toStrictEqual({
            done: false,
            body: 'Buy bananas',
          })

          // delete
          const deletedTodosObj = produce(todosObj, (draft) => {
            // @ts-ignore
            delete draft['id1']
          })
          expect(Object.keys(deletedTodosObj)).toHaveLength(1)
          expect(deletedTodosObj.id1).toBeUndefined()

          // update
          const updatedTodosObj = produce(todosObj, (draft) => {
            draft['id1'].done = true
          })
          expect(updatedTodosObj.id1.done).toBe(true)
        })
      })

      describe('Array mutations', () => {
        const todosArray = [
          { id: 'id1', done: false, body: 'Take out the trash' },
          { id: 'id2', done: false, body: 'Check Email' },
        ]

        // add
        const producedArray1 = produce(todosArray, (draft) => {
          draft.push({ id: 'id3', done: false, body: 'Buy bananas' })
        })
        expect(producedArray1).toHaveLength(3)

        // delete by index
        const producedArray2 = produce(todosArray, (draft) => {
          draft.splice(1, 1)
        })
        expect(producedArray2).toHaveLength(1)
        expect(producedArray2[0].id).toBe('id1')

        // update by index
        const producedArray3 = produce(todosArray, (draft) => {
          draft[1].done = true
        })
        expect(producedArray3[1].done).toBe(true)

        // insert at index
        const producedArray4 = produce(todosArray, (draft) => {
          draft.splice(3, 0, { id: 'id3', done: false, body: 'Buy bananas' })
        })
        expect(producedArray4).toHaveLength(3)
        expect(producedArray4[2]).toStrictEqual({
          id: 'id3',
          done: false,
          body: 'Buy bananas',
        })

        // remove last item
        const producedArray5 = produce(todosArray, (draft) => {
          draft.pop()
        })
        expect(producedArray5).toHaveLength(1)
        expect(producedArray5[0].id).toBe('id1')

        // remove first item
        const producedArray6 = produce(todosArray, (draft) => {
          draft.shift()
        })
        expect(producedArray6).toHaveLength(1)
        expect(producedArray6[0].id).toBe('id2')

        // add item at the beginning of the array
        const producedArray7 = produce(todosArray, (draft) => {
          draft.unshift({ id: 'id3', done: false, body: 'Buy bananas' })
        })
        expect(producedArray7).toHaveLength(3)
        expect(producedArray7[0].id).toBe('id3')

        // delete by id
        const producedArray8 = produce(todosArray, (draft) => {
          const index = draft.findIndex((todo) => todo.id === 'id1')
          if (index !== -1) draft.splice(index, 1)
        })
        expect(producedArray8).toHaveLength(1)
        expect(producedArray8[0].id).toBe('id2')

        // update by id
        const producedArray9 = produce(todosArray, (draft) => {
          const index = draft.findIndex((todo) => todo.id === 'id1')
          if (index !== -1) draft[index].done = true
        })
        expect(producedArray9).toHaveLength(2)
        expect(producedArray9[0].done).toBe(true)

        // filtering items
        const producedArray10 = produce(todosArray, (draft) => {
          return draft.filter((todo) => todo.done)
        })
        expect(producedArray10).toHaveLength(0)
      })

      describe('Nested data structures', () => {
        // example complex data structure
        const store = {
          users: new Map([
            [
              '17',
              {
                name: 'Michel',
                todos: [
                  {
                    title: 'Get coffee',
                    done: false,
                  },
                ],
              },
            ],
          ]),
        }

        const nextStore1 = produce(store, (draft) => {
          // @ts-ignore
          draft.users.get('17').todos[0].done = true
        })
        // @ts-ignore
        expect(store.users.get('17').todos[0].done).toBe(false)
        // @ts-ignore
        expect(nextStore1.users.get('17').todos[0].done).toBe(true)

        const nextStore2 = produce(store, (draft) => {
          const user = draft.users.get('17')
          // @ts-ignore
          user.todos = user.todos.filter((todo) => todo.done)
        })
        // @ts-ignore
        expect(store.users.get('17').todos).toHaveLength(1)
        // @ts-ignore
        expect(nextStore2.users.get('17').todos).toHaveLength(0)
      })
    })
  })
})

export {}
