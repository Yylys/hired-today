import store from '@/store'

export default function (app) {
  app.directive("hasPermi", {
    mounted(el, binding, vnode) {
      const { value } = binding
      // console.log(store,'store')
      const all_permission = "*:*:*";
      const permissions = store.state.value.user.permissions
      if (value && value instanceof Array && value.length > 0) {
        const permissionFlag = value
        const hasPermissions = permissions.some(permission => {
          return all_permission === permission || permissionFlag.includes(permission)
        })
        if (!hasPermissions) {
          el.parentNode && el.parentNode.removeChild(el)
        }
      } else {
        throw new Error(`请设置操作权限标签值`)
      }
    }
  })
}




// export default {
//   inserted(el, binding, vnode) {
//     const { value } = binding
//     console.log(value,'value')
//     alert('msg');
//     const all_permission = "*:*:*";
//     const permissions = store.permissions
//     if (value && value instanceof Array && value.length > 0) {
//       const permissionFlag = value
//       const hasPermissions = permissions.some(permission => {
//         return all_permission === permission || permissionFlag.includes(permission)
//       })
//       // console.log(hasPermissions,'hasPermissions')

//       if (!hasPermissions) {
//         el.parentNode && el.parentNode.removeChild(el)
//       }
//     } else {
//       throw new Error(`请设置操作权限标签值`)
//     }
//   }
// }