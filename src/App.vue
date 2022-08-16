<template>
  <div>
    <div id="Formulario" class="container">
      <div id="Nobre">
        
        <div class="form-group">
          <fieldset>
            <label class="form-label mt-4" for="readOnlyInput">RFC</label>
            <input class="form-control" type="text" v-model="this.rfc" />
          </fieldset>
        </div>
      </div>
      <div id="PassWord">
        <div class="form-group">
          <fieldset>
            <label class="form-label mt-4" for="readOnlyInput">Password</label>
            <input
              class="form-control"
              type="password"
              v-model="this.password"
            />
          </fieldset>
        </div>
      </div>
      <div id=".key">
        <div class="form-group">
          <label for="formFile" class="form-label mt-4"
            >sube el archivo .key</label
          >
          <input class="form-control" type="file" accept=".key" id="key" />
        </div>
      </div>
      <div id=".car">
        <div class="form-group">
          <label for="formFile" class="form-label mt-4"
            >sube el archivo .cer</label
          >
          <input class="form-control" type="file" accept=".cer" id="cer" />
        </div>
      </div>
      <div id="SUMIT">
        <button class="btn btn-primary" @click="btnEncriprar()">Enviar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data: function () {
    return {
      KEY: "",
      rfc: "",
      password: "",
      Eemail: "",
      Epassword: "",
      pkey: null,
      pcer: null,
      //url : "http://trsffirmadigitalserviciocertificados-dev.eba-qrs52xqc.us-west-1.elasticbeanstalk.com/"
      url: "https://localhost:7045/Certificados/",
    };
  },
  methods: {
    btnEncriprar() {
      var FormData = require("form-data");
      var data = new FormData();
      this.KEY = createGuid()  
      this.$http
        .get(
          "https://localhost:7045/Certificados/GetKeyToUploadCertificate?rfc=" +
            this.rfc +
            "&key=" +
            this.KEY
        )
        .then((response) => {
          //var IV = this.$CryptoJS.enc.Hex.parse( )
          //var key1 =
          var key = this.$CryptoJS.enc.Utf8.parse(
            this.KEY.slice(0, 16).toUpperCase()
          );
          var iv = this.$CryptoJS.enc.Utf8.parse(
            response.data.iv.slice(0, 16).toUpperCase()
          );
          this.Epassword = this.$CryptoJS.AES.encrypt(
            this.$CryptoJS.enc.Utf8.parse(this.password),
            key,
            {
              keySize: 128 / 8,
              iv: iv,
              mode: this.$CryptoJS.mode.CBC,
              padding: this.$CryptoJS.pad.Pkcs7,
            }
          ).toString();

          //console.log(this.Epassword)
          //console.log(IV +"\n"+key);

          //this.pkey = document.getElementById("key").files[0]
          //this.pcer = document.getElementById("cer").files[0]

          data.append("filecer", document.getElementById("cer").files[0]);
          data.append("fileKey", document.getElementById("key").files[0]);

          var config = {
            method: "post",
            url:
              "https://localhost:7045/Certificados?IdRequest=" +
              response.data.id,
            headers: {
              Password: this.Epassword,
            },
            data: data,
          };
          console.log(config);

          this.$http(config)
            .then(function (response) {
              alert(JSON.stringify(response.data));
            })
            .catch(function (error) {
              alert(error);
            });

          /**/
        });
    },
  },
};

function createGuid()  
{  
   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {  
      var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);  
      return v.toString(16);  
   });  
}  
</script>
