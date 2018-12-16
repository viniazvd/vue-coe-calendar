import { shallowMount } from '@vue/test-utils'
import { getMonth, getYear } from '../src/support/services'
import { getCalendar } from '../src/support/services/calendar'
import { equals } from './services'

import VueCoeCalendar from '../src/Index.vue'

/* eslint-disable */
describe('Index', () => {
  test('is a Vue instance', () => {
    const wrapper = shallowMount(VueCoeCalendar, { propsData: { date: '' } })

    expect (wrapper.isVueInstance()).toBeTruthy()
  })

  test('is not opened', () => {
    const wrapper = shallowMount(VueCoeCalendar, {
      propsData: {
        date: '',
        show: false
      }
    })

    expect(wrapper.vm.show).toBe(false)
  })

  test('is opened', () => {
    const wrapper = shallowMount(VueCoeCalendar, {
      propsData: {
        date: '',
        show: true
      }
    })

    expect(wrapper.vm.show).toBe(true)
  })

  test('default: showMonths and showYears', () => {
    const wrapper = shallowMount(VueCoeCalendar, {
      propsData: { date: '' }
    })

    expect(wrapper.vm.showMonths).toBe(false)
    expect(wrapper.vm.showYears).toBe(false)
  })

  test('is range', () => {
    const wrapper = shallowMount(VueCoeCalendar, {
      propsData: {
        date: '',
        isRange: true
      }
    })

    expect(wrapper.vm.isRange).toBe(true)
  })

  test('is not range', () => {
    const wrapper = shallowMount(VueCoeCalendar, {
      propsData: {
        date: ''
      }
    })

    expect(wrapper.vm.isRange).toBe(false)
  })

  test('default date', () => {
    const wrapper = shallowMount(VueCoeCalendar, {
      propsData: {
        date: '',
        show: true
      }
    })

    const date = new Date()
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' }

    const currentDate = date.toLocaleDateString('pt-BR', options)

    const month = +getMonth(currentDate)
    const year = +getYear(currentDate)

    expect(wrapper.vm.month).toEqual(month)
    expect(wrapper.vm.year).toEqual(year)
  })

  test('internalDate without range', () => {
    const wrapper = shallowMount(VueCoeCalendar, {
      propsData: {
        date: '',
        show: true
      }
    })

    expect(wrapper.vm.internalDate).toEqual('')
  })

  test('internalDate with range', () => {
    const wrapper = shallowMount(VueCoeCalendar, {
      propsData: {
        date: '',
        show: true,
        isRange: true
      }
    })

    expect(wrapper.vm.internalDate).toEqual({
      start: null,
      end: null
    })
  })

  test('default calendar', () => {
    const wrapper = shallowMount(VueCoeCalendar, {
      propsData: {
        date: '',
        show: true
      }
    })

    const date = new Date()
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' }

    const currentDate = date.toLocaleDateString('pt-BR', options)

    const month = +getMonth(currentDate)
    const year = +getYear(currentDate)

    const calendar = getCalendar.call(wrapper.vm, year, month - 1)
    const isEqual = equals(calendar, wrapper.vm.calendar)

    expect(isEqual).toBe(true)
  })

  test('passing a date', () => {
    const wrapper = shallowMount(VueCoeCalendar, {
      propsData: {
        date: '15/12/2017',
        show: true
      }
    })

    expect(wrapper.vm.day).toBe(15)
    expect(wrapper.vm.month).toBe(12)
    expect(wrapper.vm.year).toBe(2017)
  })
})

// WIP
// test('pick day', () => {
//   const wrapper = shallowMount(VueCoeCalendar, {
//     propsData: {
//       date: '15/12/2017',
//       show: true
//     }
//   })

//   const day = wrapper.find('.day-container')

//   expect(wrapper.vm.day).toBe(15)
// })
