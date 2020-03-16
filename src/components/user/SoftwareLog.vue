<template>
    <!--软件日志-->
  <div>
    <div style="text-align: center"><h2> 软件日志</h2></div>
    <div class="accordion" id="accordionExample">
      <div class="card">
        <div class="card-header">
          <button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse"
                  data-target="#collapseOne">
            2020-03-11
          </button>
        </div>
        <div id="collapseOne" class="collapse show">
          <div class="card-body">
            <table class="table" >
              <tbody>
              <tr>
                <th>编写软件使用文档</th>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
    export default {
        name: "SoftwareLog"
    }
</script>

<style scoped>

</style>
