import { mount, shallowMount } from '@vue/test-utils'

import { getMonth, getYear } from '../src/support/services/index.js'
// import { getCalendar } from '../src/support/services/calendar'
import { equals } from './services'

import VueCoeCalendar from '../src/Index.vue'
import CoeDay from '../src/components/CoeDay.vue'
import CoeHeader from '../src/components/CoeHeader.vue'
import CoeReset from '../src/components/CoeReset.vue'
import CoeSelections from '../src/components/CoeSelections.vue'
import CoeWeek from '../src/components/CoeWeek.vue'

/* eslint-disable */
describe('VueCoeCalendar', () => {
  test('is a Vue instance', () => {
    const wrapper = shallowMount(VueCoeCalendar, { propsData: { date: '' } })

    expect (wrapper.isVueInstance()).toBeTruthy()
  })

  test('wrapper class name', () => {
    const wrapper = shallowMount(VueCoeCalendar, {
      propsData: { date: '' }
    })

    expect(wrapper.attributes().class).toBe('vue-coe-calendar')
    expect(wrapper.classes()).toContain('vue-coe-calendar')
    expect(wrapper.find('.vue-coe-calendar').exists()).toBe(true)
  })

  test('wrapper is', () => {
    const wrapper = shallowMount(VueCoeCalendar, {
      propsData: { date: '' }
    })

    wrapper.setData({ showMonths: false, showYears: false })

    expect(wrapper.contains('div')).toBe(true)
    expect(wrapper.contains(CoeDay)).toBe(true)
    expect(wrapper.contains(CoeHeader)).toBe(true)
    expect(wrapper.contains(CoeReset)).toBe(true)
    expect(wrapper.contains(CoeSelections)).toBe(false)
    expect(wrapper.contains(CoeWeek)).toBe(true)
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
      propsData: { date: '', isRange: true }
    })

    expect(wrapper.vm.isRange).toBe(true)
    expect(wrapper.props('isRange')).toBe(true)
  })

  test('is not range', () => {
    const wrapper = shallowMount(VueCoeCalendar, {
      propsData: { date: '' }
    })

    expect(wrapper.vm.isRange).toBe(false)
    expect(wrapper.props('isRange')).toBe(false)
  })

  test('default date', () => {
    const wrapper = shallowMount(VueCoeCalendar, {
      propsData: { date: '' }
    })

    const date = new Date()
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' }

    const currentDate = date.toLocaleDateString('pt-BR', options)

    const month = +getMonth(currentDate)
    const year = +getYear(currentDate)

    expect(wrapper.vm.month).toEqual(month)
    expect(wrapper.vm.year).toEqual(year)
  })

  test('default internalDate', () => {
    const wrapper = shallowMount(VueCoeCalendar, {
      propsData: { date: '' }
    })

    expect(wrapper.vm.internalDate).toEqual('')
  })

  test('default calendar', () => {
    const wrapper = shallowMount(VueCoeCalendar, {
      propsData: { date: '' }
    })

    wrapper.setData({ month: 1, year: 2019 })

    // const date = new Date()
    // const options = { day: '2-digit', month: '2-digit', year: 'numeric' }

    // const currentDate = date.toLocaleDateString('pt-BR', options)

    // console.log('currentDate', currentDate)

    // const month = +getMonth(currentDate)
    // const year = +getYear(currentDate)

    // fix adapt getMonth and getYear to acept '-' or '/'

    const month = +'1'
    const year = +'2019'

    const calendar = wrapper.vm.getCalendar(year, month - 1)
    const isEqual = equals(calendar, wrapper.vm.calendar)

    expect(isEqual).toBe(true)
  })

  test('passing a date', () => {
    const wrapper = shallowMount(VueCoeCalendar, {
      propsData: { date: '15/12/2017' }
    })

    expect(wrapper.vm.day).toBe(15)
    expect(wrapper.vm.month).toBe(12)
    expect(wrapper.vm.year).toBe(2017)
  })

  test('change month: dateHandler = "<"', () => {
    const wrapper = mount(VueCoeCalendar, {
      propsData: { date: '29/01/1989' }
    })

    wrapper
      .find('.container-calendar')
      .find('.header-container')
      .findAll('span').at(0)
      .trigger('click')

    expect(wrapper.vm.month).toEqual(12)
  })

  test('change month: list', () => {
    const wrapper = mount(VueCoeCalendar, {
      propsData: { date: '29/01/1989' }
    })

    wrapper
      .find('.container-calendar')
      .find('.header-container')
      .find('.date-preview')
      .findAll('span').at(0)
      .trigger('click')

    wrapper
      .find('.options-selection')
      .find('.months')
      .findAll('.month').at(2)
      .trigger('click')

    expect(wrapper.vm.month).toEqual(3)
  })

  test('change year: list', () => {
    const wrapper = mount(VueCoeCalendar, {
      propsData: { date: '29/01/1989' }
    })

    wrapper
      .find('.container-calendar')
      .find('.header-container')
      .find('.date-preview')
      .findAll('span').at(1)
      .trigger('click')

    wrapper
      .find('.options-selection')
      .find('.years')
      .findAll('.year').at(2)
      .trigger('click')

    expect(wrapper.vm.year).toEqual(1962)
  })

  test('reset date', () => {
    const wrapper = mount(VueCoeCalendar, {
      propsData: { date: '29/01/1989' }
    })

    wrapper.find('div > div > div > button').trigger('click')

    expect(wrapper.vm.day).toEqual(null)
    expect(wrapper.vm.finalDay).toEqual(null)
    expect(wrapper.vm.internalDate).toEqual('')
  })

  test('pick day', () => {
    const wrapper = mount(VueCoeCalendar, {
      propsData: { date: '29/01/1989' }
    })

    wrapper
      .find('.container-calendar')
      .find('.day-container')
      .findAll('div').at(15)
      .find('span')
      .trigger('click')

    expect(wrapper.vm.day).toEqual(10)
  })

  test('pick a not selectable day', () => {
    const wrapper = mount(VueCoeCalendar, {
      propsData: { date: '29/01/1989' }
    })

    wrapper
      .find('.container-calendar')
      .find('.day-container')
      .findAll('div').at(0)
      .find('span')
      .trigger('click')

    expect(wrapper.vm.day).toEqual(29)
  })

  test('showDisabledDays is true', () => {
    const wrapper = mount(VueCoeCalendar, {
      propsData: { date: '16/12/2018', showDisabledDays: true }
    })

    const day = wrapper
      .find('.container-calendar')
      .find('.coe-day')
      .find('.day-container')
      .find('.day')

    expect(day.classes()).toContain('-hide')
  })
})
